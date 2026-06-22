"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "aurum.cookie-consent.v1";

/**
 * Lightweight cookie-consent banner. Stores the choice in localStorage.
 *
 * TODO (client): if you add analytics or marketing cookies that require prior
 * consent (e.g. under GDPR), gate them on `localStorage[STORAGE_KEY] === "all"`
 * rather than loading them unconditionally.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage unavailable — don't block the page */
    }
  }, []);

  function choose(choice: "all" | "essential") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
    >
      <div className="container-px">
        <div className="card flex flex-col items-start gap-4 border-gold/20 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-zinc-300">
            We use essential cookies to run this site and optional cookies to
            understand usage. See our{" "}
            <Link href="/privacy" className="text-gold-light underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-3">
            <button
              onClick={() => choose("essential")}
              className="btn-outline px-5 py-2 text-xs"
            >
              Essential only
            </button>
            <button
              onClick={() => choose("all")}
              className="btn-gold px-5 py-2 text-xs"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
