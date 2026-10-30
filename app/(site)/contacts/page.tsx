import type { Metadata } from "next";
import { openGraph } from "@/lib/seo";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactBox } from "@/components/sections/contact-box";
import { ContactLinks } from "@/components/sections/contact-links";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import { SectionTitle } from "@/components/ui/section-title";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contacts",
  description: "Get in touch with Mahmoud Ebeid for freelance work, full-time roles or questions.",
  alternates: { canonical: "/contacts" },
  openGraph: openGraph("/contacts"),
};

export default async function ContactsPage() {
  const profile = await getProfile();
  const directLinks = profile.socials.filter(({ platform }) => platform !== "github");

  return (
    <Container className="flex flex-col gap-16 pt-12">
      <PageTitle name="contacts" subtitle="Get in touch" />

      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
        <p className="max-w-[505px]">{profile.contactText}</p>
        <ContactBox links={directLinks} headingLevel="h2" />
      </div>

      <section aria-labelledby="send-message" className="flex flex-col gap-8">
        <SectionTitle id="send-message" name="send-message" />
        <ContactForm />
      </section>

      <section aria-labelledby="all-media" className="flex flex-col gap-8">
        <SectionTitle id="all-media" name="all-media" line={false} />
        <ContactLinks links={profile.socials} className="flex-row flex-wrap gap-x-8" />
      </section>
    </Container>
  );
}
