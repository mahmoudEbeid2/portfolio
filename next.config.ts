import type { NextConfig } from "next";

// Only this account's images may pass through the image optimizer.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://i.ytimg.com/vi/**"),
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/206378225" },
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
