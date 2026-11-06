import { requireAdminPage } from "@/lib/auth/require-admin";

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  await requireAdminPage();
  return children;
}
