import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aurum — Investment-Grade Gold Bullion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 25% 15%, #1c1c21, #0c0c0e 70%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
              color: "#0c0c0e",
              background: "linear-gradient(135deg,#e6c878,#c8a24a,#9a7a2e)",
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: 40,
              color: "#e6c878",
              letterSpacing: 6,
            }}
          >
            AURUM
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 76,
            lineHeight: 1.05,
            color: "#fafafa",
            maxWidth: 900,
          }}
        >
          <span>Own gold that&nbsp;</span>
          <span style={{ color: "#c8a24a" }}>holds its worth.</span>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "#a1a1aa",
            fontFamily: "sans-serif",
          }}
        >
          Certified bars & coins · Responsibly sourced unrefined gold
        </div>
      </div>
    ),
    { ...size }
  );
}
