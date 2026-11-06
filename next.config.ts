import type { NextConfig } from "next";

// Only this account's images may pass through the image optimizer.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  // Holds every icon, so it loads at runtime instead of going into each server bundle.
  serverExternalPackages: ["simple-icons"],
  images: {
    remotePatterns: [
      new URL("https://i.ytimg.com/vi/**"),
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/9919" },
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
