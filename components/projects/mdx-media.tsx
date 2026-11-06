import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const BODY_SIZES = "(min-width: 768px) 768px, 100vw";

type ZoomableImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
};

/** A lazy image that opens in the lightbox; see `MdxBody`. */
function ZoomableImage({ src, alt, sizes = BODY_SIZES, className }: ZoomableImageProps) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={`View image: ${alt}`}
      data-lightbox-src={src}
      data-lightbox-alt={alt}
      className={cn("relative block aspect-video w-full border border-line", className)}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-contain" />
    </button>
  );
}

/** A Markdown image. It renders inside a paragraph, so it stays inline-safe. */
export function MdxImage({ src, alt }: { src?: string | Blob; alt?: string }) {
  if (typeof src !== "string") return null;
  return <ZoomableImage src={src} alt={alt ?? ""} />;
}

const figureSizes = {
  small: "mx-auto max-w-sm",
  normal: "",
  wide: "mdx-wide",
};

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  size?: keyof typeof figureSizes;
};

export function Figure({ src, alt, caption, size = "normal" }: FigureProps) {
  return (
    <figure className={cn("mb-6", figureSizes[size])}>
      <ZoomableImage
        src={src}
        alt={alt}
        sizes={size === "wide" ? "(min-width: 1024px) 976px, 100vw" : BODY_SIZES}
      />
      {caption && <figcaption className="mt-2 text-sm">{caption}</figcaption>}
    </figure>
  );
}

const gridColumns = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

type ImageGridProps = {
  cols: keyof typeof gridColumns;
  children: ReactNode;
};

export function ImageGrid({ cols, children }: ImageGridProps) {
  return <div className={cn("mb-6 grid gap-4 [&>figure]:mb-0", gridColumns[cols])}>{children}</div>;
}

type GalleryProps = {
  images: { src: string; alt: string }[];
};

export function Gallery({ images }: GalleryProps) {
  return (
    <ul className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {images.map(({ src, alt }) => (
        <li key={src}>
          <ZoomableImage src={src} alt={alt} sizes="(min-width: 640px) 192px, 50vw" />
        </li>
      ))}
    </ul>
  );
}

type MdxButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export function MdxButton({ href, label, variant = "primary" }: MdxButtonProps) {
  return (
    <div className="mb-6">
      <ButtonLink href={href} variant={variant}>
        {label}
      </ButtonLink>
    </div>
  );
}
