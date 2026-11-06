import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityForm } from "@/components/admin/activity-form";
import { AdminTitle } from "@/components/admin/admin-title";
import { getActivityForEdit } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Edit activity" };

export default async function EditActivityPage({ params }: PageProps<"/admin/activities/[id]">) {
  await requireAdminPage();
  const { id } = await params;

  const found = await getActivityForEdit(id);
  if (!found) notFound();
  const { id: activityId, ...activity } = found;

  return (
    <>
      <AdminTitle title="edit-activity" />
      <ActivityForm id={activityId} activity={activity} />
    </>
  );
}
