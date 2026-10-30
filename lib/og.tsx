import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const colors = {
  background: "#282c33",
  gray: "#abb2bf",
  white: "#ffffff",
  primary: "#c778dd",
};

type OgImageProps = {
  /** Small label above the title, e.g. "#projects". */
  eyebrow: string;
  title: string;
  description?: string;
  tags?: readonly string[];
};

/** Renders a branded 1200×630 Open Graph image. */
export function renderOgImage({ eyebrow, title, description, tags = [] }: OgImageProps) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: colors.background,
        color: colors.gray,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          color: colors.white,
          fontSize: 32,
        }}
      >
        <div style={{ display: "flex", position: "relative", width: 32, height: 32 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 20,
              height: 20,
              border: `2px solid ${colors.white}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 20,
              height: 20,
              border: `2px solid ${colors.white}`,
            }}
          />
        </div>
        Mahmoud Ebeid
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 32, color: colors.primary }}>{eyebrow}</div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: colors.white,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {description && (
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, maxWidth: 1000 }}>
            {description}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {tags.slice(0, 6).map((tag) => (
          <div
            key={tag}
            style={{
              display: "flex",
              border: `2px solid ${colors.gray}`,
              padding: "6px 14px",
              fontSize: 24,
            }}
          >
            {tag}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            marginLeft: "auto",
            width: 48,
            height: 48,
            border: `2px solid ${colors.primary}`,
          }}
        />
      </div>
    </div>,
    ogSize,
  );
}
