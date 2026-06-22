import { business } from "@/data/business";

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendResult {
  ok: boolean;
  /** True when no provider was configured, so nothing was sent. */
  skipped?: boolean;
}

/**
 * Send a transactional email via Resend (https://resend.com).
 *
 * If `RESEND_API_KEY` is not set, this no-ops and logs instead of throwing, so
 * the app works end-to-end in development without email credentials.
 *
 * TODO (client): set RESEND_API_KEY and a verified RESEND_FROM in your env to
 * enable real email delivery (quote notifications + order receipts).
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendArgs): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Aurum <onboarding@resend.dev>";

  if (!key) {
    console.info("[aurum] email skipped (no RESEND_API_KEY)", { to, subject });
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
    });
    if (!res.ok) {
      console.error("[aurum] email send failed", res.status, await res.text());
    }
    return { ok: res.ok };
  } catch (e) {
    console.error("[aurum] email send error", e);
    return { ok: false };
  }
}

export function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

/** Wrap content in a branded, charcoal/gold email shell. */
export function emailLayout(title: string, inner: string): string {
  return `<div style="background:#0c0c0e;padding:32px;font-family:system-ui,Arial,sans-serif;color:#e4e4e7">
    <div style="max-width:560px;margin:0 auto;background:#16161a;border:1px solid #26262d;border-radius:16px;overflow:hidden">
      <div style="padding:24px 28px;border-bottom:1px solid #26262d;display:flex;align-items:center">
        <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;border-radius:999px;background:linear-gradient(135deg,#e6c878,#c8a24a,#9a7a2e);color:#0c0c0e;font-weight:700;font-family:Georgia,serif">A</span>
        <span style="margin-left:12px;font-family:Georgia,serif;font-size:18px;color:#fafafa">Aurum</span>
      </div>
      <div style="padding:28px">
        <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;color:#fafafa">${title}</h1>
        ${inner}
      </div>
      <div style="padding:18px 28px;border-top:1px solid #26262d;font-size:12px;color:#71717a">
        ${escapeHtml(business.legalName)} · ${escapeHtml(business.email)}<br/>
        Precious-metals prices fluctuate; this is not investment advice.
      </div>
    </div>
  </div>`;
}
