import { createHash } from "node:crypto";

type CloudinaryConfig = { cloudName: string; apiKey: string; apiSecret: string };

/** Returns `null` until all three keys are set, which disables uploads. */
export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

/** Cloudinary's request signature: sorted params plus the secret, hashed. */
export function signParams(params: Record<string, string>, apiSecret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1")
    .update(payload + apiSecret)
    .digest("hex");
}
