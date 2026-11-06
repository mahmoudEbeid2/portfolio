import { Schema } from "mongoose";
import { socialPlatforms, type SocialLinkData } from "@/lib/schemas";
import { defineModel } from "./define-model";

type SocialLinkDocument = SocialLinkData & { order: number };

const socialLinkSchema = new Schema<SocialLinkDocument>(
  {
    platform: { type: String, enum: socialPlatforms, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const SocialLink = defineModel<SocialLinkDocument>("SocialLink", socialLinkSchema);
