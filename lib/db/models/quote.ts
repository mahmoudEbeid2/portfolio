import { Schema } from "mongoose";
import type { QuoteData } from "@/lib/schemas";
import { defineModel } from "./define-model";

const quoteSchema = new Schema<QuoteData>(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Quote = defineModel<QuoteData>("Quote", quoteSchema);
