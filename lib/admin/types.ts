import type { SkillItem } from "@/lib/schemas";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type AdminValue = string | string[] | SkillItem[];

/** A list row as the dashboard edits it. */
export type AdminItem = { id: string } & Record<string, AdminValue>;

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
};

export type AdminActivity = {
  id: string;
  type: string;
  title: string;
  status: string;
  featured: boolean;
};

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};
