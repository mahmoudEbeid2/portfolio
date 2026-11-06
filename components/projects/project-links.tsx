import type { Project } from "@/lib/content";
import { groupLinks } from "@/lib/project-links";
import { ProjectLinkButton } from "./project-link-button";

export function ProjectLinks({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {groupLinks(links).map(({ name, links: grouped }) => (
        <section key={name} aria-label={name || "Project links"} className="flex flex-col gap-2">
          {name && <h2 className="text-sm font-medium">{name}</h2>}
          <ul className="flex flex-wrap gap-4">
            {grouped.map((link) => (
              <li key={link.url}>
                <ProjectLinkButton link={link} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
