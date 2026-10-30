import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: Project;
  /** Hides the cover image (used for small projects). */
  compact?: boolean;
  className?: string;
};

export function ProjectCard({ project, compact = false, className }: ProjectCardProps) {
  const { slug, title, summary, cover, stack, links } = project;
  const href = `/projects/${slug}`;

  return (
    <Card as="article" className={cn("project-card h-full", className)}>
      {!compact && cover && (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block aspect-[330/201] border-b border-gray"
        >
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </Link>
      )}
      {stack.length > 0 && <p className="border-b border-gray p-2">{stack.join(" ")}</p>}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h3 className="text-2xl font-medium">
          <Link href={href} className="transition-colors hover:text-primary">
            {title}
          </Link>
        </h3>
        <p className="flex-1">{summary}</p>
        <div className="flex flex-wrap gap-4">
          {links.demo && (
            <ButtonLink href={links.demo} aria-label={`${title} live demo`}>
              Live &lt;~&gt;
            </ButtonLink>
          )}
          {links.github && (
            <ButtonLink href={links.github} variant="secondary" aria-label={`${title} on GitHub`}>
              GitHub &gt;=
            </ButtonLink>
          )}
          {!links.demo && !links.github && (
            <ButtonLink href={href} variant="secondary">
              Details -&gt;
            </ButtonLink>
          )}
        </div>
      </div>
    </Card>
  );
}
