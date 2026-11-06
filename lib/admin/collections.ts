import { courseStatuses, socialPlatforms } from "@/lib/schemas";
import type { AdminItem } from "./types";

export type FieldConfig = {
  name: string;
  label: string;
  /** `lines` edits a string list as one entry per line. */
  kind: "text" | "textarea" | "lines" | "select";
  options?: readonly string[];
  hint?: string;
};

export type CollectionConfig = {
  noun: string;
  fields: readonly FieldConfig[];
  title: (item: AdminItem) => string;
  subtitle?: (item: AdminItem) => string;
};

/** How each simple list is edited. Safe to import from client components. */
export const collections = {
  experience: {
    noun: "position",
    fields: [
      { name: "role", label: "Role", kind: "text" },
      { name: "company", label: "Company", kind: "text" },
      { name: "location", label: "Location", kind: "text" },
      { name: "start", label: "Start", kind: "text", hint: "e.g. Mar 2025" },
      { name: "end", label: "End", kind: "text", hint: "Leave empty for your current role." },
      { name: "achievements", label: "Achievements", kind: "lines", hint: "One per line." },
    ],
    title: (item) => `${String(item.role)} — ${String(item.company)}`,
    subtitle: (item) => `${String(item.start)} – ${String(item.end) || "present"}`,
  },
  skills: {
    noun: "skill group",
    fields: [
      { name: "name", label: "Group name", kind: "text" },
      { name: "items", label: "Skills", kind: "lines", hint: "One per line." },
    ],
    title: (item) => String(item.name),
    subtitle: (item) => (item.items as string[]).join(", "),
  },
  education: {
    noun: "education entry",
    fields: [
      { name: "degree", label: "Degree", kind: "text" },
      { name: "school", label: "School", kind: "text" },
      { name: "start", label: "Start", kind: "text" },
      { name: "end", label: "End", kind: "text" },
    ],
    title: (item) => String(item.degree),
    subtitle: (item) => String(item.school),
  },
  courses: {
    noun: "course",
    fields: [
      { name: "name", label: "Course", kind: "text" },
      { name: "instructor", label: "Instructor", kind: "text" },
      { name: "platform", label: "Platform", kind: "text" },
      { name: "year", label: "Year", kind: "text" },
      { name: "status", label: "Status", kind: "select", options: courseStatuses },
    ],
    title: (item) => String(item.name),
    subtitle: (item) => `${String(item.platform)} · ${String(item.status)}`,
  },
  funFacts: {
    noun: "fun fact",
    fields: [{ name: "text", label: "Fact", kind: "text" }],
    title: (item) => String(item.text),
  },
  socials: {
    noun: "social link",
    fields: [
      { name: "platform", label: "Platform", kind: "select", options: socialPlatforms },
      { name: "label", label: "Label", kind: "text" },
      { name: "url", label: "URL", kind: "text", hint: "Use mailto: or tel: for email and phone." },
    ],
    title: (item) => String(item.label),
    subtitle: (item) => String(item.url),
  },
} as const satisfies Record<string, CollectionConfig>;

export type CollectionKey = keyof typeof collections;
