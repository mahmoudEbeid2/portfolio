import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { isAdminEmail } from "@/lib/auth/admin-email";

type GitHubEmail = { email: string; primary: boolean; verified: boolean };

/** GitHub accounts can list unverified addresses, so only verified ones count. */
async function ownsAdminEmail(accessToken: string): Promise<boolean> {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "portfolio-admin" },
  });
  if (!response.ok) return false;

  const emails = (await response.json()) as GitHubEmail[];
  return emails.some(({ email, verified }) => verified && isAdminEmail(email));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  trustHost: true,
  callbacks: {
    async signIn({ account }) {
      return account?.access_token ? ownsAdminEmail(account.access_token) : false;
    },
    // The session email must be the admin one even if GitHub picked another address.
    jwt({ token, account }) {
      if (account) token.email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      return token;
    },
  },
});
