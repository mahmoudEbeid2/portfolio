"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getCloudinaryConfig, signParams } from "@/lib/cloudinary";
import { uploadKinds, type UploadKind } from "@/lib/upload-kinds";

const LARGEST_IMAGE_WIDTH = "2400";

export type SignedUpload = {
  url: string;
  fields: Record<string, string>;
};

/**
 * Authorizes one direct browser upload. Files skip our servers, which avoids
 * Vercel's body limit, and the signature fixes the folder and allowed formats.
 */
export async function signUpload(kind: UploadKind): Promise<SignedUpload | { error: string }> {
  await requireAdmin();

  if (!Object.hasOwn(uploadKinds, kind)) return { error: "Unknown upload type." };
  const config = getCloudinaryConfig();
  if (!config) {
    return { error: "Uploads are disabled: the Cloudinary environment variables aren't set." };
  }

  const { folder, formats, resourceType } = uploadKinds[kind];
  const params: Record<string, string> = {
    allowed_formats: formats.join(","),
    folder,
    timestamp: String(Math.floor(Date.now() / 1000)),
    ...(resourceType === "image" && { transformation: `c_limit,w_${LARGEST_IMAGE_WIDTH}` }),
  };

  return {
    url: `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`,
    fields: {
      ...params,
      api_key: config.apiKey,
      signature: signParams(params, config.apiSecret),
    },
  };
}

/** Checks that visitors can open an uploaded file. Only fetches our own cloud. */
export async function canDeliver(url: string): Promise<boolean> {
  await requireAdmin();

  const config = getCloudinaryConfig();
  const ownFile =
    config && String(url).startsWith(`https://res.cloudinary.com/${config.cloudName}/`);
  if (!ownFile) return false;

  const response = await fetch(url, { method: "HEAD", cache: "no-store" });
  return response.ok;
}
