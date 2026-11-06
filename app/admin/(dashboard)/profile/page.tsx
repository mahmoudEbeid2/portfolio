import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { ProfileForm } from "@/components/admin/profile-form";
import { QuoteForm } from "@/components/admin/quote-form";
import { getProfileForEdit, getQuoteForEdit, listItems } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  await requireAdminPage();
  const [profile, quote, socials] = await Promise.all([
    getProfileForEdit(),
    getQuoteForEdit(),
    listItems("socials"),
  ]);

  return (
    <>
      <AdminTitle title="profile" />
      {profile ? (
        <ProfileForm profile={profile} />
      ) : (
        <p>The profile hasn&apos;t been seeded yet.</p>
      )}
      <div className="mt-10">
        <AdminTitle title="social-links" />
        <CollectionEditor collection="socials" items={socials} />
      </div>
      <div className="mt-10">
        <AdminTitle title="quote" />
        <QuoteForm quote={quote ?? { text: "", author: "" }} />
      </div>
    </>
  );
}
