"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO (client): forward to an error-monitoring service (e.g. Sentry).
    console.error("[aurum] unhandled error", error);
  }, [error]);

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-20">
      <div className="max-w-md text-center">
        <p className="font-serif text-6xl text-gold-gradient bg-gold-gradient bg-clip-text text-transparent">
          Oops
        </p>
        <h1 className="mt-4 font-serif text-3xl text-zinc-50">
          Something went wrong
        </h1>
        <p className="mt-3 text-zinc-400">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={reset} className="btn-gold">
            Try again
          </button>
          <Link href="/" className="btn-outline">
            Back home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-zinc-600">Reference: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
