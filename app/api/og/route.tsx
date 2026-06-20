import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "";
  const guest = searchParams.get("guest") ?? "";
  const city = searchParams.get("city") ?? "";

  const n = hash(title);

  // Two accent hues — always warm (20–55°) to stay on-brand
  const hue1 = 20 + (n % 35);
  const hue2 = 25 + ((n * 13) % 30);

  // Blob positions derived from title
  const bx1 = -80 + (n % 200);
  const by1 = -120 + ((n * 3) % 250);
  const bx2 = 200 + ((n * 7) % 250);
  const by2 = 300 + ((n * 11) % 300);

  const titleSize = title.length > 70 ? 34 : title.length > 45 ? 40 : 48;

  return new ImageResponse(
    (
      <div
        style={{
          width: 600,
          height: 750,
          background: "#09090b",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Blob 1 */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${hue1},85%,55%,0.28) 0%, transparent 68%)`,
            top: by1,
            left: bx1,
          }}
        />
        {/* Blob 2 */}
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${hue2},70%,45%,0.18) 0%, transparent 68%)`,
            top: by2,
            left: bx2,
          }}
        />

        {/* Bottom scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(9,9,11,0.15) 0%, rgba(9,9,11,0.55) 50%, rgba(9,9,11,0.96) 100%)",
          }}
        />

        {/* Subtle grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            padding: 52,
          }}
        >
          {/* Top label */}
          <div style={{ display: "flex" }}>
            <span
              style={{
                color: "#f97316",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              CIUDADHUB · ÚLTIMO EPISODIO
            </span>
          </div>

          {/* Title — grows to fill middle */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              paddingTop: 32,
              paddingBottom: 32,
            }}
          >
            <h1
              style={{
                color: "#fafafa",
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.12,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom: divider + guest */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div
              style={{
                width: 32,
                height: 2,
                background: "#f97316",
                marginBottom: 16,
              }}
            />
            <span
              style={{ color: "#e4e4e7", fontSize: 18, fontWeight: 600 }}
            >
              {guest}
            </span>
            {city && (
              <span style={{ color: "#71717a", fontSize: 14, marginTop: 4 }}>
                {city}
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    { width: 600, height: 750 }
  );
}
