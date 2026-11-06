"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons";

export type LightboxImage = { src: string; alt: string };

type LightboxProps = {
  label: string;
  images: LightboxImage[];
  startIndex?: number;
  onClose: () => void;
};

const SWIPE_DISTANCE = 50;

/**
 * Full-screen image viewer. Mount it to open and unmount it on `onClose`. A modal
 * <dialog> blocks the page behind it, closes on Esc and returns focus to the opener.
 */
export function Lightbox({ label, images, startIndex = 0, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef(0);
  const [index, setIndex] = useState(startIndex);

  const count = images.length;
  const image = images[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function step(delta: number) {
    setIndex((current) => (current + delta + count) % count);
  }

  // A modal already blocks the page behind it. This also stops Tab reaching the browser UI.
  function keepFocusInside(event: KeyboardEvent) {
    const buttons = dialogRef.current?.querySelectorAll("button");
    const first = buttons?.[0];
    const last = buttons?.[buttons.length - 1];
    const edge = event.shiftKey ? first : last;
    if (document.activeElement !== edge) return;

    event.preventDefault();
    (event.shiftKey ? last : first)?.focus();
  }

  function endSwipe(endX: number) {
    const distance = endX - swipeStart.current;
    if (Math.abs(distance) >= SWIPE_DISTANCE) step(distance < 0 ? 1 : -1);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
        if (event.key === "Tab") keepFocusInside(event);
      }}
      onTouchStart={(event) => {
        swipeStart.current = event.touches[0]?.clientX ?? 0;
      }}
      onTouchEnd={(event) => endSwipe(event.changedTouches[0]?.clientX ?? 0)}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none flex-col gap-2 bg-background/95 p-4 text-gray open:flex"
    >
      <div className="flex items-center justify-between">
        <p aria-live="polite">
          {index + 1} / {count}
        </p>
        <button
          type="button"
          aria-label="Close gallery"
          onClick={() => dialogRef.current?.close()}
          className="flex size-11 items-center justify-center transition-colors hover:text-white"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        {image && (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        )}
      </div>

      <p aria-hidden="true" className="text-center">
        {image?.alt}
      </p>

      {count > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="secondary" aria-label="Previous image" onClick={() => step(-1)}>
            &lt;-
          </Button>
          <Button variant="secondary" aria-label="Next image" onClick={() => step(1)}>
            -&gt;
          </Button>
        </div>
      )}
    </dialog>
  );
}
