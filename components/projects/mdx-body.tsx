"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Lightbox, type LightboxImage } from "@/components/ui/lightbox";

type OpenState = { images: LightboxImage[]; index: number };

/**
 * Wraps rendered MDX. Images stay plain buttons in the markup, so one click handler
 * here can open every image on the page in a single lightbox, in reading order.
 */
export function MdxBody({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<OpenState | null>(null);

  function onClick(event: MouseEvent) {
    const clicked = (event.target as Element).closest<HTMLElement>("[data-lightbox-src]");
    if (!clicked || !rootRef.current) return;

    const buttons = [...rootRef.current.querySelectorAll<HTMLElement>("[data-lightbox-src]")];
    setOpen({
      images: buttons.map(({ dataset }) => ({
        src: dataset.lightboxSrc ?? "",
        alt: dataset.lightboxAlt ?? "",
      })),
      index: buttons.indexOf(clicked),
    });
  }

  return (
    <>
      <div ref={rootRef} onClick={onClick}>
        {children}
      </div>
      {open && (
        <Lightbox
          label="Project images"
          images={open.images}
          startIndex={open.index}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
