import { Schema } from "mongoose";
import type { SkillGroupData } from "@/lib/schemas";
import { defineModel } from "./define-model";

type SkillGroupDocument = SkillGroupData & { order: number };

const skillGroupSchema = new Schema<SkillGroupDocument>(
  {
    name: { type: String, required: true },
    items: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const SkillGroup = defineModel<SkillGroupDocument>("SkillGroup", skillGroupSchema);
