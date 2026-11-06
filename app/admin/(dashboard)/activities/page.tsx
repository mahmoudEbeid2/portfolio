import type { Metadata } from "next";
import { ActivityList } from "@/components/admin/activity-list";
import { AdminTitle } from "@/components/admin/admin-title";
import { ButtonLink } from "@/components/ui/button";
import { listActivities } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Activities" };

export default async function ActivitiesPage() {
  await requireAdminPage();
  const activities = await listActivities();

  return (
    <>
      <AdminTitle
        title="activities"
        description="Drag to change the order on the home page, which shows up to 3 featured items per tab. The activities page sorts them newest first."
        action={<ButtonLink href="/admin/activities/new">New activity</ButtonLink>}
      />
      <ActivityList activities={activities} />
    </>
  );
}
