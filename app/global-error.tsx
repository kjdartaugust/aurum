"use client";

import { useEffect } from "react";

/**
 * Catches errors in the root layout itself. Must render its own <html>/<body>
 * because the root layout failed. Kept dependency-free with inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[aurum] root error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0e",
          color: "#e4e4e7",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", color: "#e6c878" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#a1a1aa" }}>
            We hit an unexpected error. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 22px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              color: "#0c0c0e",
              background: "linear-gradient(135deg,#e6c878,#c8a24a,#9a7a2e)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
