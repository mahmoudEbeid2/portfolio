import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { Project } from "@/lib/content";
import { ProjectCard } from "./project-card";

type ProjectGridProps = {
  id: string;
  title: string;
  projects: Project[];
  compact?: boolean;
  /** Set on the first grid of a page, whose first cover is the largest paint. */
  priorityFirst?: boolean;
};

export function ProjectGrid({
  id,
  title,
  projects,
  compact = false,
  priorityFirst = false,
}: ProjectGridProps) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby={id} className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id={id} name={title} line={false} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard
                project={project}
                compact={compact}
                priority={priorityFirst && index === 0}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
