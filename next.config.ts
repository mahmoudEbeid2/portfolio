import type { NextConfig } from "next";

// Only this account's images may pass through the image optimizer.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  // These hold every icon, so they load at runtime instead of going into each server bundle.
  serverExternalPackages: ["simple-icons", "@primer/octicons"],
  images: {
    remotePatterns: [
      new URL("https://i.ytimg.com/vi/**"),
      ...(cloudName ? [new URL(`https://res.cloudinary.com/${cloudName}/**`)] : []),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
