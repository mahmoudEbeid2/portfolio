import { Fragment } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { GitHubIcon } from "@/components/ui/icons";
import { Octicon } from "@/components/ui/octicon";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { SectionMark, SectionMarkFrame } from "@/components/ui/section-mark";
import type { Profile } from "@/lib/content";
import { getCvLink } from "@/lib/cv-link";
import { githubProfileUrl, githubUsername } from "@/lib/site";
import { CvButton } from "./cv-button";

function separator(index: number, total: number): string {
  if (index === 0) return "";
  return index === total - 1 ? " and " : ", ";
}

export function Hero({ profile }: { profile: Profile }) {
  const { name, fullName, roles, headline, photo, cvUrl } = profile;

  return (
    <section aria-labelledby="hero-title" className="py-12 md:py-16">
      <Container className="grid items-center gap-12 md:grid-cols-[1fr_minmax(0,420px)]">
        <div className="flex flex-col items-start gap-6">
          <h1 id="hero-title" className="text-[32px] font-semibold">
            {name} is a{" "}
            {roles.map((role, index) => (
              <Fragment key={role}>
                {separator(index, roles.length)}
                <span className="text-primary">{role}</span>
              </Fragment>
            ))}
            <span aria-hidden="true" className="caret" />
          </h1>
          {headline && <p>{headline}</p>}
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/contacts">Contact me !!</ButtonLink>
            {cvUrl && <CvButton {...getCvLink(cvUrl)} />}
          </div>
        </div>

        <div className="flex flex-col">
          {photo ? (
            <SectionMarkFrame>
              <ProfilePhoto
                src={photo}
                alt={fullName}
                priority
                className="relative aspect-[457/386] w-full"
              />
            </SectionMarkFrame>
          ) : (
            <SectionMark link={{ href: githubProfileUrl, label: "GitHub profile" }}>
              <Octicon name="mark-github" />
            </SectionMark>
          )}
          <a
            href={githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-2 border border-line p-2 transition-colors hover:text-white"
          >
            <GitHubIcon className="size-4 shrink-0" />@{githubUsername}
          </a>
        </div>
      </Container>
    </section>
  );
}
