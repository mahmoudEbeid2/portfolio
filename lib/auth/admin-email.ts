/** True only for ADMIN_EMAIL. An unset ADMIN_EMAIL locks everyone out. */
export function isAdminEmail(email: string | null | undefined): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin) && email?.trim().toLowerCase() === admin;
}
