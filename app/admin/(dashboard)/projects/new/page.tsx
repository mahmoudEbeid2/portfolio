import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdminPage } from "@/lib/auth/require-admin";
import type { ProjectData } from "@/lib/schemas";

export const metadata: Metadata = { title: "New project" };

const emptyProject: ProjectData = {
  slug: "",
  title: "",
  summary: "",
  category: "complete-app",
  featured: false,
  order: 0,
  cover: null,
  gallery: [],
  stack: [],
  role: "",
  isTeamProject: false,
  timeline: "",
  links: { demo: null, github: null, other: [] },
  status: "draft",
  body: "",
};

export default async function NewProjectPage() {
  await requireAdminPage();

  return (
    <>
      <AdminTitle title="new-project" />
      <ProjectForm id={null} project={emptyProject} />
    </>
  );
}
