import type { SocialLink } from "@/lib/site";
import { SocialLinks } from "./social-links";

type SideSocialBarProps = {
  links: readonly SocialLink[];
};

/** Fixed vertical social bar on the left edge (wide screens only). */
export function SideSocialBar({ links }: SideSocialBarProps) {
  return (
    <aside
      aria-label="Social media"
      className="fixed top-0 left-4 z-30 hidden flex-col items-center gap-2 xl:flex"
    >
      <span aria-hidden="true" className="h-48 w-px bg-gray" />
      <SocialLinks links={links} className="flex-col gap-0" />
    </aside>
  );
}
