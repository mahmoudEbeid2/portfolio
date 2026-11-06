import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/cn";
import { cardLinks, isLive } from "@/lib/project-links";
import { ProjectLinkButton } from "./project-link-button";

type ProjectCardProps = {
  project: Project;
  /** Hides the cover image (used for small projects). */
  compact?: boolean;
  /** Preloads the cover; use it on the card that's the page's largest paint. */
  priority?: boolean;
  className?: string;
};

export function ProjectCard({
  project,
  compact = false,
  priority = false,
  className,
}: ProjectCardProps) {
  const { slug, title, summary, cover, stack, links, videos, isOpenSource, isTeamProject } =
    project;
  const href = `/projects/${slug}`;
  const shownLinks = cardLinks(links);
  const badges = [
    isOpenSource && "open source",
    isLive(links) && "live",
    isTeamProject && "team",
  ].filter(Boolean);

  return (
    <Card as="article" className={cn("project-card h-full", className)}>
      {!compact && cover && (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block aspect-[330/201] border-b border-line"
        >
          <Image
            src={cover}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </Link>
      )}
      {stack.length > 0 && <p className="border-b border-line p-2">{stack.join(" ")}</p>}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h3 className="text-2xl font-medium">
          <Link href={href} className="transition-colors hover:text-primary">
            {title}
          </Link>
        </h3>
        {(badges.length > 0 || videos.length > 0) && (
          <ul className="flex flex-wrap gap-2 text-sm">
            {badges.map((badge) => (
              <li key={String(badge)}>
                <Tag>{badge}</Tag>
              </li>
            ))}
            {videos.length > 0 && (
              <li>
                <Tag className="border-primary">
                  <span aria-hidden="true">{"\u25B6\uFE0E"} </span>video
                </Tag>
              </li>
            )}
          </ul>
        )}
        <p className="flex-1">{summary}</p>
        <div className="flex flex-wrap gap-4">
          {shownLinks.map((link) => (
            <ProjectLinkButton key={link.url} link={link} context={`for ${title}`} />
          ))}
          {shownLinks.length === 0 && (
            <ButtonLink href={href} variant="secondary">
              Details<span className="sr-only"> about {title}</span>
              <span aria-hidden="true">-&gt;</span>
            </ButtonLink>
          )}
        </div>
      </div>
    </Card>
  );
}
