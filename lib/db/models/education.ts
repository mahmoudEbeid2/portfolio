import { Schema } from "mongoose";
import type { EducationData } from "@/lib/schemas";
import { defineModel } from "./define-model";

type EducationDocument = EducationData & { order: number };

const educationSchema = new Schema<EducationDocument>(
  {
    degree: { type: String, required: true },
    school: { type: String, required: true },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: "education" },
);

export const Education = defineModel<EducationDocument>("Education", educationSchema);
