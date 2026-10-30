import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DotGrid } from "@/components/ui/dot-grid";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { SectionTitle } from "@/components/ui/section-title";
import type { Profile } from "@/lib/content";

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
          <div className="relative mx-auto w-full max-w-[340px]">
            <DotGrid cols={5} rows={4} className="absolute top-8 -left-4 z-10" />
            <DotGrid cols={4} rows={5} className="absolute right-0 bottom-16 z-10" />
            <ProfilePhoto
              src={aboutPhoto}
              alt={fullName}
              sizes="340px"
              className="aspect-[339/507] w-full"
            />
            <span aria-hidden="true" className="block h-px w-full bg-primary" />
          </div>
        </div>
      </Container>
    </section>
  );
}
