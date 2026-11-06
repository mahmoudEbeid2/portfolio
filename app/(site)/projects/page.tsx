import type { Metadata } from "next";
import { openGraph } from "@/lib/seo";
import { ProjectBrowser } from "@/components/projects/project-browser";
import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "SaaS platforms, backend APIs, libraries and web & mobile apps built by Mahmoud Ebeid.",
  alternates: { canonical: "/projects" },
  openGraph: openGraph("/projects"),
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const firstFeatured = projects.find((project) => project.featured);

  return (
    <Container className="flex flex-col gap-12 py-12">
      <PageTitle name="projects" subtitle="List of my projects" />
      <h2 className="sr-only">All projects</h2>
      <ProjectBrowser
        projects={projects.map((project) => ({
          slug: project.slug,
          category: project.category,
          isOpenSource: project.isOpenSource,
          featured: project.featured,
          card: (
            <ProjectCard
              project={project}
              compact={!project.featured}
              priority={project === firstFeatured}
            />
          ),
        }))}
      />
    </Container>
  );
}
