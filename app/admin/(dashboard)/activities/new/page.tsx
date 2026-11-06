import type { Metadata } from "next";
import { ActivityForm } from "@/components/admin/activity-form";
import { AdminTitle } from "@/components/admin/admin-title";
import { requireAdminPage } from "@/lib/auth/require-admin";
import type { ActivityData } from "@/lib/schemas";

export const metadata: Metadata = { title: "New activity" };

const emptyActivity: ActivityData = {
  type: "competition",
  title: "",
  organization: "",
  role: "",
  result: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  coverImage: null,
  gallery: [],
  links: [],
  featured: false,
  order: 0,
  status: "draft",
};

export default async function NewActivityPage() {
  await requireAdminPage();

  return (
    <>
      <AdminTitle title="new-activity" />
      <ActivityForm id={null} activity={emptyActivity} />
    </>
  );
}
