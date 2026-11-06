"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { connectToDatabase } from "@/lib/db/connect";
import {
  attempt,
  invalid,
  nextOrder,
  objectId,
  objectIds,
  refreshContent,
  saveOrder,
} from "../action-helpers";
import type { CollectionKey } from "../collections";
import { registry } from "../registry";
import type { ActionResult } from "../types";

function entryFor(collection: CollectionKey) {
  if (!Object.hasOwn(registry, collection)) throw new Error("Unknown collection");
  return registry[collection];
}

export async function saveItem(
  collection: CollectionKey,
  id: string | null,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const { model, schema, tag } = entryFor(collection);

  const parsed = schema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  return attempt(async () => {
    await connectToDatabase();
    if (id === null) {
      await model.create({ ...parsed.data, order: await nextOrder(model) });
    } else {
      await model.updateOne({ _id: objectId.parse(id) }, { $set: parsed.data });
    }
    refreshContent(tag);
    return { ok: true, message: "Saved." };
  });
}

export async function deleteItem(collection: CollectionKey, id: string): Promise<ActionResult> {
  await requireAdmin();
  const { model, tag } = entryFor(collection);

  return attempt(async () => {
    await connectToDatabase();
    await model.deleteOne({ _id: objectId.parse(id) });
    refreshContent(tag);
    return { ok: true, message: "Deleted." };
  });
}

export async function reorderItems(
  collection: CollectionKey,
  ids: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const { model, tag } = entryFor(collection);

  return attempt(async () => {
    await connectToDatabase();
    await saveOrder(model, objectIds.parse(ids));
    refreshContent(tag);
    return { ok: true, message: "Order saved." };
  });
}
