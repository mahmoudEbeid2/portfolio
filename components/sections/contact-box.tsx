import type { SocialLink } from "@/lib/content";
import { ContactLinks } from "./contact-links";

type ContactBoxProps = {
  links: readonly SocialLink[];
};

/** Bordered "Message me here" box with direct contact links. */
export function ContactBox({ links }: ContactBoxProps) {
  return (
    <div className="flex w-full flex-col gap-4 border border-gray p-4 sm:w-fit">
      <h3 className="font-semibold">Message me here</h3>
      <ContactLinks links={links} />
    </div>
  );
}
