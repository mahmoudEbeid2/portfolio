import { Schema } from "mongoose";
import type { ProfileData } from "@/lib/schemas";
import { defineModel } from "./define-model";

const profileSchema = new Schema<ProfileData>(
  {
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    roles: { type: [String], default: [] },
    headline: { type: String, default: "" },
    tagline: { type: String, default: "" },
    bio: { type: [String], default: [] },
    contactText: { type: String, default: "" },
    photo: { type: String, default: null },
    aboutPhoto: { type: String, default: null },
    cvUrl: { type: String, default: null },
    location: { type: String, default: "" },
    email: { type: String, required: true },
    availableForWork: { type: Boolean, default: true },
    showRepoStat: { type: Boolean, default: true },
    showNpmStat: { type: Boolean, default: true },
    showYoutubeStat: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

export const Profile = defineModel<ProfileData>("Profile", profileSchema);
