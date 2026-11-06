import { Schema } from "mongoose";
import { courseStatuses, type CourseData } from "@/lib/schemas";
import { defineModel } from "./define-model";

type CourseDocument = CourseData & { order: number };

const courseSchema = new Schema<CourseDocument>(
  {
    name: { type: String, required: true },
    instructor: { type: String, default: "" },
    platform: { type: String, default: "" },
    year: { type: String, default: "" },
    status: { type: String, enum: courseStatuses, default: "completed" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const Course = defineModel<CourseDocument>("Course", courseSchema);
