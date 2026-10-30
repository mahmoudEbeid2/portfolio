import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { Profile } from "@/lib/content";
import { ContactBox } from "./contact-box";

export function Contacts({ profile }: { profile: Profile }) {
  const links = profile.socials.filter(({ platform }) => platform === "email" || platform === "linkedin");

  return (
    <section aria-labelledby="contacts" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="contacts" name="contacts" />
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <p className="max-w-[505px]">{profile.contactText}</p>
          <ContactBox links={links} />
        </div>
      </Container>
    </section>
  );
}
