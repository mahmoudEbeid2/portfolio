"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getSkillIcon, type SkillIcon } from "@/lib/skill-icons";

/** Resolves slugs for the live preview, keeping the icon data out of the client bundle. */
export async function previewSkillIcons(slugs: string[]): Promise<Record<string, SkillIcon | null>> {
  await requireAdmin();
  return Object.fromEntries(slugs.map((slug) => [slug, getSkillIcon(slug)]));
}
