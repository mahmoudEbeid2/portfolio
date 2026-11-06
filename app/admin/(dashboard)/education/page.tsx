import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { listItems } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Education & Courses" };

export default async function EducationPage() {
  await requireAdminPage();
  const [education, courses] = await Promise.all([listItems("education"), listItems("courses")]);

  return (
    <>
      <AdminTitle title="education" />
      <CollectionEditor collection="education" items={education} />
      <div className="mt-10">
        <AdminTitle title="courses" />
        <CollectionEditor collection="courses" items={courses} />
      </div>
    </>
  );
}
