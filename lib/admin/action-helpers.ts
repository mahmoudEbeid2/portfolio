import { revalidatePath, updateTag } from "next/cache";
import type { Model } from "mongoose";
import { z } from "zod";
import type { ActionResult } from "./types";

export const objectId = z.string().regex(/^[0-9a-f]{24}$/);
export const objectIds = z.array(objectId).max(500);

/** Turns a Zod error into per-field messages keyed by dotted path. */
export function invalid(error: z.ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[issue.path.join(".")] ??= issue.message;
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
}

/** Expires a content tag and re-renders every static page that may use it. */
export function refreshContent(tag: string): void {
  updateTag(tag);
  revalidatePath("/", "layout");
}

export async function nextOrder<T>(model: Model<T>): Promise<number> {
  const last = await model.findOne().sort({ order: -1 }).select("order").lean<{ order: number }>();
  return (last?.order ?? -1) + 1;
}

export async function saveOrder<T>(model: Model<T>, ids: string[]): Promise<void> {
  await Promise.all(ids.map((id, order) => model.updateOne({ _id: id }, { $set: { order } })));
}

/** Runs a mutation and reports unexpected failures as a toast-friendly result. */
export async function attempt(run: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await run();
  } catch (error) {
    console.error("Dashboard action failed:", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
