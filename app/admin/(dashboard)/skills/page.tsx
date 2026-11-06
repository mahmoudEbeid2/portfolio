import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { listItems } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Skills" };

export default async function SkillsPage() {
  await requireAdminPage();

  return (
    <>
      <AdminTitle title="skills" />
      <CollectionEditor collection="skills" items={await listItems("skills")} />
    </>
  );
}
