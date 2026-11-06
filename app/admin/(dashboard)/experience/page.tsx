import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { listItems } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  await requireAdminPage();

  return (
    <>
      <AdminTitle title="experience" />
      <CollectionEditor collection="experience" items={await listItems("experience")} />
    </>
  );
}
