import { Schema } from "mongoose";
import type { SkillGroupData, SkillItem } from "@/lib/schemas";
import { defineModel } from "./define-model";

type SkillGroupDocument = SkillGroupData & { order: number };

const skillItemSchema = new Schema<SkillItem>(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "" },
  },
  { _id: false },
);

const skillGroupSchema = new Schema<SkillGroupDocument>(
  {
    name: { type: String, required: true },
    items: { type: [skillItemSchema], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const SkillGroup = defineModel<SkillGroupDocument>("SkillGroup", skillGroupSchema);
