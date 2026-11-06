const MEGABYTE = 1024 * 1024;

const imageUpload = {
  resourceType: "image",
  formats: ["jpg", "png", "webp", "avif"],
  accept: "image/jpeg,image/png,image/webp,image/avif",
  maxBytes: 10 * MEGABYTE,
} as const;

/** What each dashboard upload accepts. Safe to import from client components. */
export const uploadKinds = {
  project: { ...imageUpload, folder: "portfolio/projects" },
  profile: { ...imageUpload, folder: "portfolio/profile" },
  cv: {
    resourceType: "raw",
    formats: ["pdf"],
    accept: "application/pdf",
    maxBytes: 10 * MEGABYTE,
    folder: "portfolio/cv",
  },
} as const;

export type UploadKind = keyof typeof uploadKinds;
