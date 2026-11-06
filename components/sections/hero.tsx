import { Fragment } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DotGrid } from "@/components/ui/dot-grid";
import { GitHubIcon } from "@/components/ui/icons";
import { OutlineSquare } from "@/components/ui/outline-square";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { cn } from "@/lib/cn";
import type { Profile } from "@/lib/content";
import { githubProfileUrl, githubUsername, heroImageUrl } from "@/lib/site";

function separator(index: number, total: number): string {
  if (index === 0) return "";
  return index === total - 1 ? " and " : ", ";
}

export function Hero({ profile }: { profile: Profile }) {
  const { name, fullName, roles, headline, photo } = profile;

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
          <ButtonLink href="/contacts">Contact me !!</ButtonLink>
        </div>

        <div className="flex flex-col">
          <div className="relative p-8">
            <OutlineSquare size={140} tone="primary" className="absolute top-0 left-0" />
            <OutlineSquare size={96} tone="primary" className="absolute right-0 bottom-0" />
            <DotGrid cols={5} rows={5} className="absolute right-12 bottom-14 z-10" />
            <ProfilePhoto
              src={photo ?? heroImageUrl}
              alt={photo ? fullName : "GitHub"}
              priority
              className={cn("relative w-full", photo ? "aspect-[457/386]" : "aspect-square")}
            />
          </div>
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
