import { unstable_cache } from "next/cache";
import { cache } from "react";
import { contentTags } from "@/lib/cache-tags";
import { connectToDatabase } from "@/lib/db/connect";
import {
  Course as CourseModel,
  Education,
  Experience,
  FunFact,
  Profile as ProfileModel,
  Project as ProjectModel,
  Quote as QuoteModel,
  SkillGroup as SkillGroupModel,
  SocialLink as SocialLinkModel,
} from "@/lib/db/models";
import type {
  CourseData,
  EducationData,
  ExperienceData,
  ProfileData,
  ProjectData,
  QuoteData,
  SkillGroupData,
  SocialLinkData,
} from "@/lib/schemas";

/**
 * Single entry point for site content. Components never query the database
 * directly — they go through the typed helpers below. Results are cached until
 * a dashboard save invalidates their tag, so public pages stay static.
 */
export type SocialLink = SocialLinkData;
export type Profile = ProfileData & { socials: SocialLink[] };
export type SkillGroup = SkillGroupData;
export type ExperienceItem = ExperienceData;
export type EducationItem = EducationData;
export type Course = CourseData;
export type Quote = QuoteData;
export type ProjectWithBody = ProjectData;
export type Project = Omit<ProjectData, "body">;
export type ProjectCategory = Project["category"];

const documentFields = { _id: 0, createdAt: 0, updatedAt: 0 } as const;
const listFields = { ...documentFields, order: 0 } as const;

/** Caches a database read across requests, then dedupes it within one render. */
function cachedRead<T>(read: () => Promise<T>, tag: string, key = tag): () => Promise<T> {
  return cache(
    unstable_cache(
      async () => {
        await connectToDatabase();
        return read();
      },
      [key],
      { tags: [tag] },
    ),
  );
}

function required<T>(value: T | null, name: string): T {
  if (!value) throw new Error(`Missing content: ${name}`);
  return value;
}

export const getProfile = cachedRead(async (): Promise<Profile> => {
  const [profile, socials] = await Promise.all([
    ProfileModel.findOne({}, documentFields).lean<ProfileData>(),
    SocialLinkModel.find({}, listFields).sort({ order: 1 }).lean<SocialLinkData[]>(),
  ]);
  return { ...required(profile, "profile"), socials };
}, contentTags.profile);

export const getSkills = cachedRead(
  () => SkillGroupModel.find({}, listFields).sort({ order: 1 }).lean<SkillGroup[]>(),
  contentTags.skills,
);

export const getExperience = cachedRead(
  () => Experience.find({}, listFields).sort({ order: 1 }).lean<ExperienceItem[]>(),
  contentTags.experience,
);

export const getEducation = cachedRead(
  () => Education.find({}, listFields).sort({ order: 1 }).lean<EducationItem[]>(),
  contentTags.education,
);

export const getCourses = cachedRead(
  () => CourseModel.find({}, listFields).sort({ order: 1 }).lean<Course[]>(),
  contentTags.courses,
);

export const getFunFacts = cachedRead(async (): Promise<string[]> => {
  const facts = await FunFact.find({}, listFields).sort({ order: 1 }).lean<{ text: string }[]>();
  return facts.map(({ text }) => text);
}, contentTags.funFacts);

export const getQuote = cachedRead(
  async (): Promise<Quote> =>
    required(await QuoteModel.findOne({}, documentFields).lean<Quote>(), "quote"),
  contentTags.quote,
);

/** Published projects, sorted by their `order` field. */
export const getProjects = cachedRead(
  () =>
    ProjectModel.find({ status: "published" }, { ...documentFields, body: 0 })
      .sort({ order: 1, slug: 1 })
      .lean<Project[]>(),
  contentTags.projects,
);

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.category === category);
}

/** A single published project with its MDX body, or `null` if it doesn't exist. */
export const getProject = cache((slug: string): Promise<ProjectWithBody | null> =>
  unstable_cache(
    async () => {
      await connectToDatabase();
      return ProjectModel.findOne(
        { slug, status: "published" },
        documentFields,
      ).lean<ProjectWithBody>();
    },
    [contentTags.projects, slug],
    { tags: [contentTags.projects] },
  )(),
);

/** The project after `slug` in display order, wrapping around to the first. */
export async function getNextProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  return projects[(index + 1) % projects.length] ?? null;
}
