import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DotGrid } from "@/components/ui/dot-grid";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import type { Profile } from "@/lib/content";

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
        <div className="relative mx-auto w-full max-w-[340px]">
          <DotGrid cols={5} rows={4} className="absolute top-8 -left-4 z-10" />
          <DotGrid cols={4} rows={5} className="absolute right-0 bottom-16 z-10" />
          <ProfilePhoto src={aboutPhoto} alt={fullName} sizes="340px" className="aspect-[339/507] w-full" />
          <span aria-hidden="true" className="block h-px w-full bg-primary" />
        </div>
      </Container>
    </section>
  );
}
