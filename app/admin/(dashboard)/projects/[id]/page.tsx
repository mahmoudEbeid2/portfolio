import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTitle } from "@/components/admin/admin-title";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectForEdit } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { projectLinkIcons } from "@/lib/project-link-icons";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdminPage();
  const { id } = await params;

  const found = await getProjectForEdit(id);
  if (!found) notFound();
  const { id: projectId, ...project } = found;

  return (
    <>
      <AdminTitle title={project.slug} />
      <ProjectForm id={projectId} project={project} linkIcons={projectLinkIcons} />
    </>
  );
}
