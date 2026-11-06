import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/auth/admin-email";

async function isAdminSession(): Promise<boolean> {
  const session = await auth();
  return isAdminEmail(session?.user?.email);
}

/** For server actions: the first line of every admin mutation. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminSession())) throw new Error("Unauthorized");
}

/** For admin pages and layouts: sends signed-out visitors to the login page. */
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdminSession())) redirect("/admin/login");
}
