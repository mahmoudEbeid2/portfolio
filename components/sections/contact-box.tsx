import type { SocialLink } from "@/lib/content";
import { ContactLinks } from "./contact-links";

type ContactBoxProps = {
  links: readonly SocialLink[];
  headingLevel?: "h2" | "h3";
};

/** Bordered "Message me here" box with direct contact links. */
export function ContactBox({ links, headingLevel: Heading = "h3" }: ContactBoxProps) {
  return (
    <div className="flex w-full flex-col gap-4 border border-gray p-4 sm:w-fit">
      <Heading className="font-semibold">Message me here</Heading>
      <ContactLinks links={links} />
    </div>
  );
}
