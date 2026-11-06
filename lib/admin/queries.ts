import type { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Activity, Message, Profile, Project, Quote } from "@/lib/db/models";
import type { ActivityData, ProfileData, ProjectData, QuoteData } from "@/lib/schemas";
import type { CollectionKey } from "./collections";
import { registry } from "./registry";
import type { AdminActivity, AdminItem, AdminMessage, AdminProject, AdminValue } from "./types";

// Dashboard reads skip the content cache so editors always see saved data.
type WithId<T> = T & { _id: Types.ObjectId };

const hiddenFields = { createdAt: 0, updatedAt: 0 } as const;

export async function listItems(collection: CollectionKey): Promise<AdminItem[]> {
  await connectToDatabase();
  const documents = await registry[collection].model
    .find({}, { ...hiddenFields, order: 0 })
    .sort({ order: 1 })
    .lean<WithId<Record<string, AdminValue>>[]>();

  return documents.map(({ _id, ...fields }) => ({ ...fields, id: _id.toString() }));
}

export async function listProjects(): Promise<AdminProject[]> {
  await connectToDatabase();
  const projects = await Project.find(
    {},
    { slug: 1, title: 1, category: 1, status: 1, featured: 1 },
  )
    .sort({ order: 1, slug: 1 })
    .lean<WithId<Omit<AdminProject, "id">>[]>();

  return projects.map(({ _id, ...fields }) => ({ ...fields, id: _id.toString() }));
}

export async function getProjectForEdit(
  id: string,
): Promise<(ProjectData & { id: string }) | null> {
  if (!/^[0-9a-f]{24}$/.test(id)) return null;

  await connectToDatabase();
  const project = await Project.findById(id, hiddenFields).lean<WithId<ProjectData>>();
  if (!project) return null;

  const { _id, ...fields } = project;
  const videos = [...(fields.videos ?? [])].sort((a, b) => a.order - b.order);
  const links = [...fields.links].sort((a, b) => a.order - b.order);
  return { ...fields, videos, links, id: _id.toString() };
}

export async function listActivities(): Promise<AdminActivity[]> {
  await connectToDatabase();
  const activities = await Activity.find({}, { type: 1, title: 1, status: 1, featured: 1 })
    .sort({ order: 1 })
    .lean<WithId<Omit<AdminActivity, "id">>[]>();

  return activities.map(({ _id, ...fields }) => ({ ...fields, id: _id.toString() }));
}

export async function getActivityForEdit(
  id: string,
): Promise<(ActivityData & { id: string }) | null> {
  if (!/^[0-9a-f]{24}$/.test(id)) return null;

  await connectToDatabase();
  const activity = await Activity.findById(id, hiddenFields).lean<WithId<ActivityData>>();
  if (!activity) return null;

  const { _id, ...fields } = activity;
  return { ...fields, id: _id.toString() };
}

export async function getProfileForEdit(): Promise<ProfileData | null> {
  await connectToDatabase();
  return Profile.findOne({}, { ...hiddenFields, _id: 0 }).lean<ProfileData>();
}

export async function getQuoteForEdit(): Promise<QuoteData | null> {
  await connectToDatabase();
  return Quote.findOne({}, { ...hiddenFields, _id: 0 }).lean<QuoteData>();
}

export async function listMessages(limit?: number): Promise<AdminMessage[]> {
  await connectToDatabase();
  const query = Message.find().sort({ createdAt: -1 });
  if (limit) query.limit(limit);

  const messages =
    await query.lean<WithId<Omit<AdminMessage, "id" | "createdAt"> & { createdAt: Date }>[]>();
  return messages.map(({ _id, name, email, message, read, createdAt }) => ({
    id: _id.toString(),
    name,
    email,
    message,
    read,
    createdAt: createdAt.toISOString(),
  }));
}

export async function countUnreadMessages(): Promise<number> {
  await connectToDatabase();
  return Message.countDocuments({ read: false });
}

export async function getOverviewStats() {
  await connectToDatabase();
  const [published, drafts, featured, messages, unread] = await Promise.all([
    Project.countDocuments({ status: "published" }),
    Project.countDocuments({ status: "draft" }),
    Project.countDocuments({ featured: true }),
    Message.countDocuments(),
    Message.countDocuments({ read: false }),
  ]);
  return { published, drafts, featured, messages, unread };
}
