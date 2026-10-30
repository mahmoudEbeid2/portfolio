import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Mahmoud Ebeid — Backend engineer & full-stack developer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "#home",
    title: "Backend engineer & full-stack developer",
    description: "SaaS platforms, payment engines and the web & mobile apps on top of them.",
    tags: ["Node.js", "NestJS", "PostgreSQL", "Redis", "React", "React Native"],
  });
}
