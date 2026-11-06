"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { contentTags } from "@/lib/cache-tags";
import { connectToDatabase } from "@/lib/db/connect";
import { Profile, Quote } from "@/lib/db/models";
import { profileSchema, quoteSchema } from "@/lib/schemas";
import { attempt, invalid, refreshContent } from "../action-helpers";
import type { ActionResult } from "../types";

export async function saveProfile(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  return attempt(async () => {
    await connectToDatabase();
    await Profile.updateOne({}, { $set: parsed.data }, { upsert: true });
    refreshContent(contentTags.profile);
    return { ok: true, message: "Profile saved." };
  });
}

export async function saveQuote(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  return attempt(async () => {
    await connectToDatabase();
    await Quote.updateOne({}, { $set: parsed.data }, { upsert: true });
    refreshContent(contentTags.quote);
    return { ok: true, message: "Quote saved." };
  });
}
