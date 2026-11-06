// Cloudinary adds the extension itself and rejects a name that includes it.
const DOWNLOAD_NAME = "Mahmoud-Ebeid-CV";

const CLOUDINARY_PDF =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:raw|image)\/upload\/)(.+\.pdf)$/;

export type CvLink = {
  href: string;
  /** True when the link saves a file, false when it opens another site. */
  isDownload: boolean;
};

/** Cloudinary PDFs download under a readable name. Anything else is a plain link. */
export function getCvLink(url: string): CvLink {
  const match = CLOUDINARY_PDF.exec(url);
  if (!match) return { href: url, isDownload: false };

  const [, base, file] = match;
  return { href: `${base}fl_attachment:${DOWNLOAD_NAME}/${file}`, isDownload: true };
}
