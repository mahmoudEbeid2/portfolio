import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Profile } from "@/lib/content";
import { AboutPhoto } from "@/components/sections/about-photo";

export function AboutIntro({ profile }: { profile: Profile }) {
  const { name, fullName, bio, aboutPhoto, location, availableForWork, cvUrl } = profile;

  return (
    <section aria-label="Introduction" className="py-12">
      <Container className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,340px)]">
        <div className="flex flex-col items-start gap-6">
          <p className="text-white">Hello, i&apos;m {name}!</p>
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {location && (
              <li>
                <span className="text-primary">@</span> {location}
              </li>
            )}
            {availableForWork && (
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 bg-primary" />
                Available for work
              </li>
            )}
          </ul>
          {cvUrl && <ButtonLink href={cvUrl}>Download CV -&gt;</ButtonLink>}
        </div>
        <AboutPhoto src={aboutPhoto} alt={fullName} />
      </Container>
    </section>
  );
}
