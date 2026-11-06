import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { Profile } from "@/lib/content";
import { AboutPhoto } from "./about-photo";
import { CoffeeMark } from "./coffee-mark";

export function AboutPreview({ profile }: { profile: Profile }) {
  const { name, fullName, bio, aboutPhoto } = profile;

  return (
    <section aria-labelledby="about-me" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="about-me" name="about-me" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,500px)]">
          <div className="flex flex-col items-start gap-6">
            <p className="text-white">Hello, i&apos;m {name}!</p>
            {bio.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ButtonLink href="/about">Read more -&gt;</ButtonLink>
          </div>
          {aboutPhoto ? (
            <AboutPhoto src={aboutPhoto} alt={fullName} />
          ) : (
            <CoffeeMark className="order-first lg:order-none" />
          )}
        </div>
      </Container>
    </section>
  );
}
