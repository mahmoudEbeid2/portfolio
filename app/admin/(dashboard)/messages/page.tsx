import type { Metadata } from "next";
import { AdminTitle } from "@/components/admin/admin-title";
import { MessageList } from "@/components/admin/message-list";
import { listMessages } from "@/lib/admin/queries";
import { requireAdminPage } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  await requireAdminPage();

  return (
    <>
      <AdminTitle title="messages" description="Everything sent through the contact form." />
      <MessageList messages={await listMessages()} />
    </>
  );
}
