"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { contentTags } from "@/lib/cache-tags";
import { connectToDatabase } from "@/lib/db/connect";
import { Activity } from "@/lib/db/models";
import { validateMdx } from "@/lib/mdx-validation";
import { activitySchema, projectStatuses } from "@/lib/schemas";
import {
  attempt,
  invalid,
  nextOrder,
  objectId,
  objectIds,
  refreshContent,
  saveOrder,
} from "../action-helpers";
import type { ActionResult } from "../types";

export async function saveActivity(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = activitySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  // Bad MDX would crash the public page, so it never reaches the database.
  const descriptionError = await validateMdx(parsed.data.description);
  if (descriptionError) {
    return {
      ok: false,
      message: "The description has an error.",
      fieldErrors: { description: descriptionError },
    };
  }

  return attempt(async () => {
    await connectToDatabase();
    if (id === null) {
      await Activity.create({ ...parsed.data, order: await nextOrder(Activity) });
    } else {
      await Activity.updateOne({ _id: objectId.parse(id) }, { $set: parsed.data });
    }
    refreshContent(contentTags.activities);
    return { ok: true, message: "Activity saved." };
  });
}

export async function deleteActivity(id: string): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await Activity.deleteOne({ _id: objectId.parse(id) });
    refreshContent(contentTags.activities);
    return { ok: true, message: "Activity deleted." };
  });
}

export async function reorderActivities(ids: string[]): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await saveOrder(Activity, objectIds.parse(ids));
    refreshContent(contentTags.activities);
    return { ok: true, message: "Order saved." };
  });
}

export async function setActivityFeatured(id: string, featured: boolean): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await Activity.updateOne(
      { _id: objectId.parse(id) },
      { $set: { featured: featured === true } },
    );
    refreshContent(contentTags.activities);
    return { ok: true };
  });
}

export async function setActivityStatus(
  id: string,
  status: (typeof projectStatuses)[number],
): Promise<ActionResult> {
  await requireAdmin();
  if (!projectStatuses.includes(status)) return { ok: false, message: "Unknown status." };

  return attempt(async () => {
    await connectToDatabase();
    await Activity.updateOne({ _id: objectId.parse(id) }, { $set: { status } });
    refreshContent(contentTags.activities);
    return { ok: true };
  });
}
