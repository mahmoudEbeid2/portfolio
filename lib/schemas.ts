import { z } from "zod";
import { isYouTubeId, parseYouTubeId } from "@/lib/youtube";

/**
 * Shared validation for seed data, admin forms and server actions. This file
 * must stay free of database imports so client components can use it.
 */
const text = z.string().trim();
const requiredText = text.min(1, "This field is required.");

// Rendered into href attributes, so schemes like javascript: are rejected.
const safeUrl = text.regex(/^(https?:\/\/|mailto:|tel:|\/(?!\/))/, "Enter a valid URL or /path.");
const nullableUrl = safeUrl.nullable();

// Cloudinary uploads, plus local paths for files kept in public/.
const imagePath = text.regex(
  /^(https:\/\/res\.cloudinary\.com\/[a-z0-9_-]+\/image\/upload\/|\/(?!\/))/,
  "Upload an image.",
);
const nullableImage = imagePath.nullable();

const slug = text.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes.");

export const socialPlatforms = ["github", "linkedin", "email", "phone"] as const;

export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatforms),
  label: requiredText,
  url: safeUrl,
});

export const profileSchema = z.object({
  name: requiredText,
  fullName: requiredText,
  roles: z.array(requiredText).min(1, "Add at least one role."),
  headline: text,
  tagline: text,
  bio: z.array(requiredText),
  contactText: text,
  photo: nullableImage,
  aboutPhoto: nullableImage,
  cvUrl: nullableUrl,
  location: text,
  email: z.email("Enter a valid email address."),
  availableForWork: z.boolean(),
  showRepoStat: z.boolean(),
  showNpmStat: z.boolean(),
  showYoutubeStat: z.boolean(),
});

const skillItemSchema = z.object({
  name: requiredText,
  // A simple-icons slug. Empty shows the name alone.
  icon: text.regex(/^[a-z0-9_]*$/, "Use the lowercase slug, like nodedotjs."),
});

export const skillGroupSchema = z.object({
  name: requiredText,
  items: z.array(skillItemSchema),
});

export const experienceSchema = z.object({
  role: requiredText,
  company: requiredText,
  location: text,
  start: text,
  end: text,
  achievements: z.array(requiredText),
});

export const educationSchema = z.object({
  degree: requiredText,
  school: requiredText,
  start: text,
  end: text,
});

export const courseStatuses = ["completed", "in-progress"] as const;

export const courseSchema = z.object({
  name: requiredText,
  instructor: text,
  platform: text,
  year: text,
  status: z.enum(courseStatuses),
});

export const funFactSchema = z.object({ text: requiredText });

export const quoteSchema = z.object({ text: requiredText, author: requiredText });

// Takes any YouTube URL and keeps only the ID. Saved IDs pass through unchanged.
const youtubeId = text.transform((value, context) => {
  const id = isYouTubeId(value) ? value : parseYouTubeId(value);
  if (id) return id;
  context.addIssue({ code: "custom", message: "Enter a valid YouTube video URL." });
  return z.NEVER;
});

const videoSchema = z.object({
  youtubeId,
  title: requiredText,
  order: z.number().int(),
});

export const projectCategories = [
  "full-stack",
  "backend",
  "frontend",
  "mobile",
  "library",
] as const;
export const projectStatuses = ["published", "draft"] as const;

export const projectSchema = z.object({
  slug,
  title: requiredText,
  summary: requiredText,
  category: z.enum(projectCategories),
  featured: z.boolean(),
  order: z.number().int(),
  cover: nullableImage,
  gallery: z.array(z.object({ image: imagePath, alt: text })),
  videos: z
    .array(videoSchema)
    .refine(
      (videos) => new Set(videos.map((video) => video.youtubeId)).size === videos.length,
      "Each video can only be added once.",
    ),
  stack: z.array(requiredText),
  role: text,
  isTeamProject: z.boolean(),
  isOpenSource: z.boolean(),
  timeline: text,
  links: z.object({
    demo: nullableUrl,
    github: nullableUrl,
    other: z.array(z.object({ label: text, url: safeUrl })),
  }),
  status: z.enum(projectStatuses),
  body: z.string(),
});

export const activityTypes = [
  "competition",
  "volunteering",
  "community",
  "talk",
  "certificate",
  "design",
] as const;

const isoDate = text.regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.");

export const activitySchema = z
  .object({
    type: z.enum(activityTypes),
    title: requiredText,
    organization: requiredText,
    role: text,
    result: text,
    location: text,
    startDate: isoDate,
    endDate: isoDate.or(z.literal("")),
    description: z.string(),
    coverImage: nullableImage,
    gallery: z.array(z.object({ image: imagePath, alt: text.min(1, "Describe this image.") })),
    links: z.array(z.object({ label: requiredText, url: safeUrl })),
    featured: z.boolean(),
    order: z.number().int(),
    status: z.enum(projectStatuses),
  })
  .superRefine(({ type, role, startDate, endDate }, context) => {
    if (type !== "certificate" && !role) {
      context.addIssue({ code: "custom", path: ["role"], message: "This field is required." });
    }
    if (endDate && endDate < startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "This can't be before the start date.",
      });
    }
  });

export type SocialLinkData = z.infer<typeof socialLinkSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
export type SkillGroupData = z.infer<typeof skillGroupSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type CourseData = z.infer<typeof courseSchema>;
export type FunFactData = z.infer<typeof funFactSchema>;
export type QuoteData = z.infer<typeof quoteSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type ActivityData = z.infer<typeof activitySchema>;
