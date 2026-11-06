"use client";

import { deleteMessage, setMessageRead } from "@/lib/admin/actions/messages";
import type { AdminMessage } from "@/lib/admin/types";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ConfirmButton } from "./confirm-button";
import { useAction } from "./use-action";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

export function MessageList({ messages }: { messages: AdminMessage[] }) {
  const { pending, run } = useAction();

  if (messages.length === 0) return <p>No messages yet.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {messages.map(({ id, name, email, message, read, createdAt }) => (
        <li key={id} className={cn("border p-4", read ? "border-line" : "border-primary")}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium text-white">
              {name} <span className="font-normal text-gray">&lt;{email}&gt;</span>
            </p>
            <p className="text-sm">
              {!read && <span className="text-primary">new · </span>}
              {dateFormat.format(new Date(createdAt))}
            </p>
          </div>
          <p className="mt-3 break-words whitespace-pre-wrap">{message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href={`mailto:${email}`} variant="secondary">
              Reply
            </ButtonLink>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => run(() => setMessageRead(id, !read))}
            >
              Mark as {read ? "unread" : "read"}
            </Button>
            <ConfirmButton
              title="Delete this message?"
              description={`From ${name}. This can't be undone.`}
              disabled={pending}
              onConfirm={() => run(() => deleteMessage(id))}
            >
              Delete
            </ConfirmButton>
          </div>
        </li>
      ))}
    </ul>
  );
}
