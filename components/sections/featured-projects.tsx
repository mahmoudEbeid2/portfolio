import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { PanelTabs } from "@/components/ui/tabs";
import type { Project } from "@/lib/content";
import { ALL_PROJECTS, pickTopProjects, projectTabs } from "@/lib/project-filters";

function TopProjects({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pickTopProjects(projects).map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const tabs = projectTabs(projects).map((tab) => ({
    ...tab,
    panel: (
      <TopProjects
        projects={
          tab.key === ALL_PROJECTS
            ? projects
            : projects.filter((project) => project.category === tab.key)
        }
      />
    ),
  }));

  return (
    <section aria-labelledby="projects" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="projects" name="projects" viewAllHref="/projects" />
        <PanelTabs label="Project categories" tabs={tabs} />
      </Container>
    </section>
  );
}
