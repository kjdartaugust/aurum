import { NextResponse } from "next/server";
import { sendEmail, emailLayout, escapeHtml } from "@/lib/email";
import { business } from "@/data/business";

interface QuoteBody {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  quantity?: string;
  message?: string;
  /** Honeypot — must stay empty. Bots tend to fill every field. */
  company?: string;
}

// --- Naive in-memory rate limit (per warm serverless instance) ---
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: QuoteBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Honeypot tripped: pretend success so bots don't learn they were caught.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, message: "Quote request received." });
  }

  if (!body.name || !body.email || !isEmail(body.email)) {
    return NextResponse.json(
      { error: "A valid name and email are required." },
      { status: 422 }
    );
  }

  const rows = Object.entries({
    Name: body.name,
    Email: body.email,
    Phone: body.phone,
    Interest: body.interest,
    "Quantity / weight": body.quantity,
    Details: body.message,
  })
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#9a7a2e;font-weight:600">${k}</td>` +
        `<td style="padding:6px 0;color:#e4e4e7">${escapeHtml(v ?? "—")}</td></tr>`
    )
    .join("");

  // Notify the business inbox. Falls back to logging if email isn't configured;
  // the client also offers a WhatsApp deep link as a second channel.
  const to = process.env.NEXT_PUBLIC_INQUIRY_EMAIL ?? business.email;
  const result = await sendEmail({
    to,
    replyTo: body.email,
    subject: `New quote request — ${body.interest ?? "gold"} (${body.name})`,
    html: emailLayout(
      "New quote request",
      `<table style="font-size:14px;border-collapse:collapse">${rows}</table>`
    ),
  });

  if (!result.ok) {
    console.info("[aurum] quote (not emailed)", {
      ...body,
      receivedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true, message: "Quote request received." });
}
