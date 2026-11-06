import type { Model } from "mongoose";
import type { z } from "zod";
import { contentTags } from "@/lib/cache-tags";
import { Course, Education, Experience, FunFact, SkillGroup, SocialLink } from "@/lib/db/models";
import {
  courseSchema,
  educationSchema,
  experienceSchema,
  funFactSchema,
  skillGroupSchema,
  socialLinkSchema,
} from "@/lib/schemas";
import type { CollectionKey } from "./collections";

type AnyDocument = Record<string, unknown>;

type RegistryEntry = {
  model: Model<AnyDocument>;
  schema: z.ZodType<AnyDocument>;
  tag: string;
};

function entry<D, S extends AnyDocument>(
  model: Model<D>,
  schema: z.ZodType<S>,
  tag: string,
): RegistryEntry {
  return {
    model: model as unknown as Model<AnyDocument>,
    schema: schema as unknown as z.ZodType<AnyDocument>,
    tag,
  };
}

export const registry: Record<CollectionKey, RegistryEntry> = {
  experience: entry(Experience, experienceSchema, contentTags.experience),
  skills: entry(SkillGroup, skillGroupSchema, contentTags.skills),
  education: entry(Education, educationSchema, contentTags.education),
  courses: entry(Course, courseSchema, contentTags.courses),
  funFacts: entry(FunFact, funFactSchema, contentTags.funFacts),
  socials: entry(SocialLink, socialLinkSchema, contentTags.profile),
};
