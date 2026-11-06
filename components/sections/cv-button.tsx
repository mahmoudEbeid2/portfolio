"use client";

import { track } from "@vercel/analytics";
import { buttonClasses } from "@/components/ui/button";
import type { CvLink } from "@/lib/cv-link";

export function CvButton({ href, isDownload }: CvLink) {
  return (
    <a
      href={href}
      {...(!isDownload && { target: "_blank", rel: "noopener noreferrer" })}
      onClick={() => track("cv_download")}
      className={buttonClasses("secondary", "hover:border-primary")}
    >
      Download CV ↓
    </a>
  );
}
