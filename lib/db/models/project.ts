import { Schema } from "mongoose";
import {
  projectCategories,
  projectLinkTypes,
  projectLinkVariants,
  projectStatuses,
  type ProjectData,
} from "@/lib/schemas";
import { defineModel } from "./define-model";

const galleryImageSchema = new Schema(
  { image: { type: String, required: true }, alt: { type: String, default: "" } },
  { _id: false },
);

const linkSchema = new Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: projectLinkTypes, default: "other" },
    variant: { type: String, enum: projectLinkVariants, default: "secondary" },
    group: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const videoSchema = new Schema(
  {
    youtubeId: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const projectSchema = new Schema<ProjectData>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    category: { type: String, enum: projectCategories, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 100, index: true },
    cover: { type: String, default: null },
    gallery: { type: [galleryImageSchema], default: [] },
    videos: { type: [videoSchema], default: [] },
    stack: { type: [String], default: [] },
    role: { type: String, default: "" },
    isTeamProject: { type: Boolean, default: false },
    isOpenSource: { type: Boolean, default: false },
    timeline: { type: String, default: "" },
    links: { type: [linkSchema], default: [] },
    status: { type: String, enum: projectStatuses, default: "published", index: true },
    body: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false },
);

export const Project = defineModel<ProjectData>("Project", projectSchema);
