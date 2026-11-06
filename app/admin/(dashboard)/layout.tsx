import { AdminShell } from "@/components/admin/admin-shell";
import { countUnreadMessages } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  await requireAdminPage();
  const unread = await countUnreadMessages();

  return <AdminShell unread={unread}>{children}</AdminShell>;
}
