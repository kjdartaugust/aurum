import { NextResponse } from "next/server";

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

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

async function sendEmail(body: QuoteBody): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NEXT_PUBLIC_INQUIRY_EMAIL;
  const from = process.env.RESEND_FROM ?? "Aurum <onboarding@resend.dev>";
  if (!key || !to) return false;

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
        `<tr><td style="padding:4px 12px 4px 0;color:#9a7a2e"><b>${k}</b></td>` +
        `<td style="padding:4px 0">${escapeHtml(String(v ?? "—"))}</td></tr>`
    )
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: body.email,
      subject: `New quote request — ${body.interest ?? "gold"} (${body.name})`,
      html: `<h2 style="font-family:Georgia,serif">New Aurum quote request</h2>
        <table style="font-family:system-ui,sans-serif;font-size:14px">${rows}</table>`,
    }),
  });
  return res.ok;
}

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

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 422 }
    );
  }

  // Deliver via email if configured; otherwise log so the UX still completes.
  // The client additionally surfaces a WhatsApp deep link as a second channel.
  let delivered = false;
  try {
    delivered = await sendEmail(body);
  } catch (e) {
    console.error("[aurum] quote email failed", e);
  }

  if (!delivered) {
    console.info("[aurum] quote request (not emailed — set RESEND_API_KEY)", {
      ...body,
      receivedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true, message: "Quote request received." });
}
