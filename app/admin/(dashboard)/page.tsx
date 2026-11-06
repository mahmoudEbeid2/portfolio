import type { Metadata } from "next";
import Link from "next/link";
import { AdminTitle } from "@/components/admin/admin-title";
import { getOverviewStats, listMessages } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  await requireAdminPage();
  const [stats, messages] = await Promise.all([getOverviewStats(), listMessages(3)]);

  const cards = [
    { label: "Published projects", value: stats.published, href: "/admin/projects" },
    { label: "Drafts", value: stats.drafts, href: "/admin/projects" },
    { label: "Featured", value: stats.featured, href: "/admin/projects" },
    { label: "Unread messages", value: stats.unread, href: "/admin/messages" },
  ];

  return (
    <>
      <AdminTitle title="overview" description="Everything on the site, in one place." />
      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ label, value, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex flex-col border border-line p-4 transition-colors hover:border-primary"
            >
              <span className="text-[32px] leading-tight font-medium text-white">{value}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-medium">Latest messages</h2>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {messages.map(({ id, name, message }) => (
              <li key={id} className="truncate border border-line p-3">
                <span className="text-white">{name}:</span> {message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
