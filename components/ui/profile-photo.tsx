import Image from "next/image";
import { cn } from "@/lib/cn";

type ProfilePhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** An uploaded profile photo. */
export function ProfilePhoto({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 768px) 420px, 90vw",
}: ProfilePhotoProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-top"
      />
    </div>
  );
}
