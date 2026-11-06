import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { ProjectList } from "@/components/admin/project-list";
import { ButtonLink } from "@/components/ui/button";
import { listProjects } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  await requireAdminPage();
  const projects = await listProjects();

  return (
    <>
      <AdminTitle
        title="projects"
        description="Drag to change the order on the site. The home page shows the first 3 featured projects."
        action={<ButtonLink href="/admin/projects/new">New project</ButtonLink>}
      />
      <ProjectList projects={projects} />
    </>
  );
}
