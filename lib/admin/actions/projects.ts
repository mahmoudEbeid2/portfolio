"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { contentTags } from "@/lib/cache-tags";
import { connectToDatabase } from "@/lib/db/connect";
import { Project } from "@/lib/db/models";
import { validateMdx } from "@/lib/mdx-validation";
import { projectSchema, projectStatuses } from "@/lib/schemas";
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

const DUPLICATE_KEY = 11000;

function isDuplicateKey(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === DUPLICATE_KEY
  );
}

export async function saveProject(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  // Bad MDX would crash the public page, so it never reaches the database.
  const bodyError = await validateMdx(parsed.data.body);
  if (bodyError) {
    return { ok: false, message: "The body has an error.", fieldErrors: { body: bodyError } };
  }

  return attempt(async () => {
    await connectToDatabase();
    try {
      if (id === null) {
        await Project.create({ ...parsed.data, order: await nextOrder(Project) });
      } else {
        await Project.updateOne({ _id: objectId.parse(id) }, { $set: parsed.data });
      }
    } catch (error) {
      if (!isDuplicateKey(error)) throw error;
      const slugTaken = "Another project already uses this slug.";
      return { ok: false, message: slugTaken, fieldErrors: { slug: slugTaken } };
    }
    refreshContent(contentTags.projects);
    return { ok: true, message: "Project saved." };
  });
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await Project.deleteOne({ _id: objectId.parse(id) });
    refreshContent(contentTags.projects);
    return { ok: true, message: "Project deleted." };
  });
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await saveOrder(Project, objectIds.parse(ids));
    refreshContent(contentTags.projects);
    return { ok: true, message: "Order saved." };
  });
}

export async function setProjectFeatured(id: string, featured: boolean): Promise<ActionResult> {
  await requireAdmin();

  return attempt(async () => {
    await connectToDatabase();
    await Project.updateOne({ _id: objectId.parse(id) }, { $set: { featured: featured === true } });
    refreshContent(contentTags.projects);
    return { ok: true };
  });
}

export async function setProjectStatus(
  id: string,
  status: (typeof projectStatuses)[number],
): Promise<ActionResult> {
  await requireAdmin();
  if (!projectStatuses.includes(status)) return { ok: false, message: "Unknown status." };

  return attempt(async () => {
    await connectToDatabase();
    await Project.updateOne({ _id: objectId.parse(id) }, { $set: { status } });
    refreshContent(contentTags.projects);
    return { ok: true };
  });
}

export async function checkBody(source: string): Promise<string | null> {
  await requireAdmin();
  return validateMdx(String(source));
}
