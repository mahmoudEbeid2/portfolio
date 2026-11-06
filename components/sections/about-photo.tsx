import { DotGrid } from "@/components/ui/dot-grid";
import { ProfilePhoto } from "@/components/ui/profile-photo";

/** Second profile photo with dot grids and a primary bottom line. */
export function AboutPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <DotGrid cols={5} rows={4} className="absolute top-8 -left-4 z-10" />
      <DotGrid cols={4} rows={5} className="absolute right-0 bottom-16 z-10" />
      <ProfilePhoto src={src} alt={alt} sizes="340px" className="aspect-[339/507] w-full" />
      <span aria-hidden="true" className="block h-px w-full bg-primary" />
    </div>
  );
}
