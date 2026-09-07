import { ImageResponse } from "next/og";

// SiFunnel brand mark rendered as the application favicon.
//
// This route takes precedence over src/app/favicon.ico, which is the
// Next.js default and can stay on disk harmlessly (or be removed).

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080b11",
          borderRadius: 16,
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 32 32"
        >
          <circle cx="16" cy="16" r="13" fill="none" stroke="#f5f7fa" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="10" fill="none" stroke="#737b84" strokeWidth="1.5" />
          <polygon points="4,6 15,11 15,21 4,26" fill="#0875ee" />
          <polygon points="14,10 22,13 22,19 14,22" fill="#16b8bb" />
          <polygon points="21,13 27,15 27,17 21,19" fill="#ff554d" />
          <polygon points="26,15 30,16 26,17" fill="#ffc21a" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
