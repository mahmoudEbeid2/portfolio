import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { listItems } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Fun facts" };

export default async function FunFactsPage() {
  await requireAdminPage();

  return (
    <>
      <AdminTitle title="fun-facts" />
      <CollectionEditor collection="funFacts" items={await listItems("funFacts")} />
    </>
  );
}
