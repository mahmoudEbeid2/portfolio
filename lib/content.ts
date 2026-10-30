import { createReader, type Entry } from "@keystatic/core/reader";
import { cache } from "react";
import keystaticConfig from "@/keystatic.config";

/**
 * Single entry point for site content. Components never read content files
 * directly — they go through the typed helpers below.
 */
const reader = createReader(process.cwd(), keystaticConfig);

type Config = typeof keystaticConfig;
type Singletons = Config["singletons"];

export type Profile = Entry<Singletons["profile"]>;
export type SkillGroup = Entry<Singletons["skills"]>["groups"][number];
export type ExperienceItem = Entry<Singletons["experience"]>["items"][number];
export type EducationItem = Entry<Singletons["education"]>["items"][number];
export type Course = Entry<Singletons["courses"]>["items"][number];
export type Quote = Entry<Singletons["quote"]>;
export type SocialLink = Profile["socials"][number];

type ProjectEntry = Entry<Config["collections"]["projects"]>;
export type Project = Omit<ProjectEntry, "body"> & { slug: string };
export type ProjectWithBody = Project & { body: string };
export type ProjectCategory = Project["category"];

async function required<T>(value: Promise<T | null>, name: string): Promise<T> {
  const result = await value;
  if (!result) throw new Error(`Missing content: ${name}`);
  return result;
}

export const getProfile = cache(() => required(reader.singletons.profile.read(), "profile"));

export const getSkills = cache(async (): Promise<readonly SkillGroup[]> => {
  const skills = await required(reader.singletons.skills.read(), "skills");
  return skills.groups;
});

export const getExperience = cache(async (): Promise<readonly ExperienceItem[]> => {
  const experience = await required(reader.singletons.experience.read(), "experience");
  return experience.items;
});

export const getEducation = cache(async (): Promise<readonly EducationItem[]> => {
  const education = await required(reader.singletons.education.read(), "education");
  return education.items;
});

export const getCourses = cache(async (): Promise<readonly Course[]> => {
  const courses = await required(reader.singletons.courses.read(), "courses");
  return courses.items;
});

export const getFunFacts = cache(async (): Promise<readonly string[]> => {
  const funFacts = await required(reader.singletons.funFacts.read(), "funFacts");
  return funFacts.items;
});

export const getQuote = cache(() => required(reader.singletons.quote.read(), "quote"));

function toProject(slug: string, entry: ProjectEntry): Project {
  const { body, ...rest } = entry;
  void body;
  return { slug, ...rest };
}

/** Published projects, sorted by their `order` field. */
export const getProjects = cache(async (): Promise<Project[]> => {
  const entries = await reader.collections.projects.all();
  return entries
    .filter(({ entry }) => entry.status === "published")
    .map(({ slug, entry }) => toProject(slug, entry))
    .sort((a, b) => a.order - b.order);
});

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.category === category);
}

/** A single published project with its MDX body, or `null` if it doesn't exist. */
export const getProject = cache(async (slug: string): Promise<ProjectWithBody | null> => {
  const entry = await reader.collections.projects.read(slug, { resolveLinkedFiles: true });
  if (!entry || entry.status !== "published") return null;
  const { body, ...rest } = entry;
  return { slug, ...rest, body };
});

/** The project after `slug` in display order, wrapping around to the first. */
export async function getNextProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  return projects[(index + 1) % projects.length] ?? null;
}
