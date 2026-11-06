import { Schema } from "mongoose";
import { activityTypes, projectStatuses, type ActivityData } from "@/lib/schemas";
import { defineModel } from "./define-model";

const galleryImageSchema = new Schema(
  { image: { type: String, required: true }, alt: { type: String, required: true } },
  { _id: false },
);

const linkSchema = new Schema(
  { label: { type: String, required: true }, url: { type: String, required: true } },
  { _id: false },
);

const activitySchema = new Schema<ActivityData>(
  {
    type: { type: String, enum: activityTypes, required: true },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    role: { type: String, default: "" },
    result: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
    coverImage: { type: String, default: null },
    gallery: { type: [galleryImageSchema], default: [] },
    links: { type: [linkSchema], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 100, index: true },
    status: { type: String, enum: projectStatuses, default: "draft", index: true },
  },
  { timestamps: true, versionKey: false },
);

export const Activity = defineModel<ActivityData>("Activity", activitySchema);
