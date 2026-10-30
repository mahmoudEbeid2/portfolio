import Image from "next/image";
import type { Project } from "@/lib/content";

export function ProjectGallery({ images, title }: { images: Project["gallery"]; title: string }) {
  if (images.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {images.map(({ image, alt }) => (
        <li key={image} className="relative aspect-video border border-gray">
          <Image
            src={image}
            alt={alt || `${title} screenshot`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
