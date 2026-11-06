import Image from "next/image";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

type ProfilePhotoProps = {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Profile photo, or a neutral placeholder until a photo is uploaded. */
export function ProfilePhoto({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 768px) 420px, 90vw",
}: ProfilePhotoProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
        />
      ) : (
        // TODO(mahmoud): upload profile photos in the Keystatic dashboard.
        <div
          role="img"
          aria-label={`${alt} (placeholder)`}
          className="flex size-full items-center justify-center border border-line text-gray"
        >
          <LogoMark className="size-20" />
        </div>
      )}
    </div>
  );
}
