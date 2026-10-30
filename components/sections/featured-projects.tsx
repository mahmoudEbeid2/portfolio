import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { Project } from "@/lib/content";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section aria-labelledby="projects" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="projects" name="projects" viewAllHref="/projects" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
