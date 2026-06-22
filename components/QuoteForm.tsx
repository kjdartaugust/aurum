"use client";

import { useState } from "react";
import { business } from "@/data/business";

const PRODUCT_INTERESTS = [
  "Refined bars",
  "Gold coins",
  "Unrefined / doré",
  "Gold nuggets",
  "Gold dust (bulk)",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [waLink, setWaLink] = useState<string | null>(null);

  const whatsapp =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? business.whatsapp;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");

      // Build a WhatsApp deep link as an immediate secondary channel.
      if (whatsapp) {
        const msg = encodeURIComponent(
          `Hello Aurum, I'd like a quote.%0A` +
            `Name: ${data.name}%0AInterest: ${data.interest}%0A` +
            `Quantity/Weight: ${data.quantity}%0ADetails: ${data.message}`
        );
        setWaLink(`https://wa.me/${whatsapp}?text=${msg}`);
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="quote" className="py-24">
      <div className="container-px">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              Bulk & unrefined
            </p>
            <h2 className="mt-3 font-serif text-4xl text-zinc-50 sm:text-5xl">
              Request a private quote
            </h2>
            <p className="mt-5 max-w-md text-zinc-400">
              For bulk bullion or unrefined gold, pricing is set against live
              spot on confirmed assay. Tell us what you need and a specialist
              will respond — by email or WhatsApp — within one business day.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-zinc-300">
              <li className="flex gap-3">
                <span className="text-gold">◆</span> Live-spot pricing, no hidden
                premiums
              </li>
              <li className="flex gap-3">
                <span className="text-gold">◆</span> Escrow settlement on large
                transactions
              </li>
              <li className="flex gap-3">
                <span className="text-gold">◆</span> KYC required for orders above
                regulatory thresholds
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="card space-y-4 p-7 sm:p-9"
          >
            {/* Honeypot — hidden from humans, tempting to bots. */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone / WhatsApp" name="phone" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-zinc-500">
                  Interest
                </label>
                <select
                  name="interest"
                  className="rounded-xl border border-white/10 bg-charcoal-100 px-4 py-3 text-sm text-zinc-100 focus:border-gold/50 focus:outline-none"
                >
                  {PRODUCT_INTERESTS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Field
              label="Quantity / weight"
              name="quantity"
              placeholder="e.g. 5 kg doré, or 20 × 1oz bars"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-zinc-500">
                Details
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Timeline, delivery destination, escrow preference…"
                className="rounded-xl border border-white/10 bg-charcoal-100 px-4 py-3 text-sm text-zinc-100 focus:border-gold/50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-gold w-full disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Request quote"}
            </button>

            {status === "success" && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-300">
                Thank you — your request is in. A specialist will be in touch
                shortly.
                {waLink && (
                  <>
                    {" "}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gold-light underline"
                    >
                      Continue on WhatsApp →
                    </a>
                  </>
                )}
              </div>
            )}
            {status === "error" && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
                Something went wrong. Please email us directly at{" "}
                {process.env.NEXT_PUBLIC_INQUIRY_EMAIL ?? business.email}.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wider text-zinc-500">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-xl border border-white/10 bg-charcoal-100 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 focus:outline-none"
      />
    </div>
  );
}
