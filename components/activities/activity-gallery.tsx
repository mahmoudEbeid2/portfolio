"use client";

import { useState } from "react";
import { Lightbox, type LightboxImage } from "@/components/ui/lightbox";

type ActivityGalleryProps = {
  title: string;
  images: LightboxImage[];
};

/** The card title, which stretches over the card, plus its lightbox. */
export function ActivityGallery({ title, images }: ActivityGalleryProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h3 className="text-2xl font-medium">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="text-left transition-colors after:absolute after:inset-0 hover:text-primary"
        >
          {title}
          <span className="sr-only">, view gallery</span>
        </button>
      </h3>
      {open && (
        <Lightbox label={`${title} gallery`} images={images} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
