import { createReader } from "@keystatic/core/reader";
import mongoose from "mongoose";
import { z } from "zod";
import keystaticConfig from "../keystatic.config";
import { connectToDatabase } from "../lib/db/connect";
import {
  Course,
  Education,
  Experience,
  FunFact,
  Profile,
  Project,
  Quote,
  SkillGroup,
  SocialLink,
} from "../lib/db/models";
import {
  courseSchema,
  educationSchema,
  experienceSchema,
  funFactSchema,
  profileSchema,
  projectSchema,
  quoteSchema,
  skillGroupSchema,
  socialLinkSchema,
} from "../lib/schemas";

/**
 * Imports everything in content/ into MongoDB. Refuses to run over existing
 * data unless --force is passed, so dashboard edits can't be lost by accident.
 * Messages are never touched.
 */
const force = process.argv.includes("--force");
const reader = createReader(process.cwd(), keystaticConfig);

function must<T>(value: T | null, name: string): T {
  if (value === null) throw new Error(`Missing content: ${name}`);
  return value;
}

function withOrder<T>(items: readonly T[]): (T & { order: number })[] {
  return items.map((item, order) => ({ ...item, order }));
}

async function loadContent() {
  const [profile, skills, experience, education, courses, funFacts, quote, projects] =
    await Promise.all([
      reader.singletons.profile.read().then((value) => must(value, "profile")),
      reader.singletons.skills.read().then((value) => must(value, "skills")),
      reader.singletons.experience.read().then((value) => must(value, "experience")),
      reader.singletons.education.read().then((value) => must(value, "education")),
      reader.singletons.courses.read().then((value) => must(value, "courses")),
      reader.singletons.funFacts.read().then((value) => must(value, "funFacts")),
      reader.singletons.quote.read().then((value) => must(value, "quote")),
      reader.collections.projects.all({ resolveLinkedFiles: true }),
    ]);

  const { socials, ...profileFields } = profile;

  // Everything is validated up front, so bad content fails before any write.
  return {
    profile: profileSchema.parse(profileFields),
    socials: withOrder(z.array(socialLinkSchema).parse(socials)),
    skillGroups: withOrder(z.array(skillGroupSchema).parse(skills.groups)),
    experience: withOrder(z.array(experienceSchema).parse(experience.items)),
    education: withOrder(z.array(educationSchema).parse(education.items)),
    courses: withOrder(z.array(courseSchema).parse(courses.items)),
    funFacts: withOrder(z.array(funFactSchema).parse(funFacts.items.map((text) => ({ text })))),
    quote: quoteSchema.parse(quote),
    projects: projects.map(({ slug, entry }) => projectSchema.parse({ slug, ...entry })),
  };
}

async function main() {
  const content = await loadContent();
  await connectToDatabase();

  if (!force && (await Project.estimatedDocumentCount()) > 0) {
    throw new Error("The database already has content. Re-run with --force to replace it.");
  }

  await Promise.all([
    Profile.deleteMany({}),
    SocialLink.deleteMany({}),
    SkillGroup.deleteMany({}),
    Experience.deleteMany({}),
    Education.deleteMany({}),
    Course.deleteMany({}),
    FunFact.deleteMany({}),
    Quote.deleteMany({}),
    Project.deleteMany({}),
  ]);

  await Promise.all([
    Profile.create(content.profile),
    Quote.create(content.quote),
    SocialLink.insertMany(content.socials),
    SkillGroup.insertMany(content.skillGroups),
    Experience.insertMany(content.experience),
    Education.insertMany(content.education),
    Course.insertMany(content.courses),
    FunFact.insertMany(content.funFacts),
    Project.insertMany(content.projects),
  ]);

  console.log("Seeded:", {
    profile: await Profile.countDocuments(),
    socialLinks: await SocialLink.countDocuments(),
    skillGroups: await SkillGroup.countDocuments(),
    experience: await Experience.countDocuments(),
    education: await Education.countDocuments(),
    courses: await Course.countDocuments(),
    funFacts: await FunFact.countDocuments(),
    quote: await Quote.countDocuments(),
    projects: await Project.countDocuments(),
  });
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
