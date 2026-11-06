"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectToDatabase } from "@/lib/db/connect";
import { Message } from "@/lib/db/models";
import { attempt, objectId } from "../action-helpers";
import type { ActionResult } from "../types";

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await Message.updateOne({ _id: objectId.parse(id) }, { $set: { read: read === true } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await Message.deleteOne({ _id: objectId.parse(id) });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Message deleted." };
  });
}
