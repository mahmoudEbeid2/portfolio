import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import { getProjectsByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "SaaS platforms, backend APIs, libraries and web & mobile apps built by Mahmoud Ebeid.",
};

export default async function ProjectsPage() {
  const [completeApps, smallProjects] = await Promise.all([
    getProjectsByCategory("complete-app"),
    getProjectsByCategory("small-project"),
  ]);

  return (
    <>
      <Container className="pt-12">
        <PageTitle name="projects" subtitle="List of my projects" />
      </Container>
      <ProjectGrid id="complete-apps" title="complete-apps" projects={completeApps} />
      <ProjectGrid id="small-projects" title="small-projects" projects={smallProjects} compact />
    </>
  );
}
