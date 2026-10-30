import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { Profile } from "@/lib/content";
import { AboutPhoto } from "./about-photo";

export function AboutPreview({ profile }: { profile: Profile }) {
  const { name, fullName, bio, aboutPhoto } = profile;

  return (
    <section aria-labelledby="about-me" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="about-me" name="about-me" />
        <div className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,340px)]">
          <div className="flex flex-col items-start gap-6">
            <p className="text-white">Hello, i&apos;m {name}!</p>
            {bio.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ButtonLink href="/about">Read more -&gt;</ButtonLink>
          </div>
          <AboutPhoto src={aboutPhoto} alt={fullName} />
        </div>
      </Container>
    </section>
  );
}
