import { Schema } from "mongoose";
import type { FunFactData } from "@/lib/schemas";
import { defineModel } from "./define-model";

type FunFactDocument = FunFactData & { order: number };

const funFactSchema = new Schema<FunFactDocument>(
  {
    text: { type: String, required: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const FunFact = defineModel<FunFactDocument>("FunFact", funFactSchema);
