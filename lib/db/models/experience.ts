import { Schema } from "mongoose";
import type { ExperienceData } from "@/lib/schemas";
import { defineModel } from "./define-model";

type ExperienceDocument = ExperienceData & { order: number };

const experienceSchema = new Schema<ExperienceDocument>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
    start: { type: String, default: "" },
    // Empty means this is the current role.
    end: { type: String, default: "" },
    achievements: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const Experience = defineModel<ExperienceDocument>("Experience", experienceSchema);
