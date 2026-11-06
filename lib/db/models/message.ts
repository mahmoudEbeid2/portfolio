import { Schema } from "mongoose";
import { defineModel } from "./define-model";

export type MessageDocument = {
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const messageSchema = new Schema<MessageDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

export const Message = defineModel<MessageDocument>("Message", messageSchema);
