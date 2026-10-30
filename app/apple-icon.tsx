import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#282c33",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 34,
          width: 74,
          height: 74,
          border: "8px solid #ffffff",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 72,
          width: 74,
          height: 74,
          border: "8px solid #c778dd",
        }}
      />
    </div>,
    size,
  );
}
