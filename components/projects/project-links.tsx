import { ButtonLink } from "@/components/ui/button";
import type { Project } from "@/lib/content";

export function ProjectLinks({ links }: { links: Project["links"] }) {
  const { demo, github, other } = links;
  if (!demo && !github && other.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-4">
      {demo && (
        <li>
          <ButtonLink href={demo}>
            Live demo <span aria-hidden="true">&lt;~&gt;</span>
          </ButtonLink>
        </li>
      )}
      {github && (
        <li>
          <ButtonLink href={github} variant="secondary">
            GitHub <span aria-hidden="true">&gt;=</span>
          </ButtonLink>
        </li>
      )}
      {other.map(({ label, url }) => (
        <li key={url}>
          <ButtonLink href={url} variant="secondary">
            {label}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
}
