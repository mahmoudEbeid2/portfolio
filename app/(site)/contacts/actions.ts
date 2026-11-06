"use server";

import { Resend } from "resend";
import {
  contactSchema,
  HONEYPOT_FIELD,
  type ContactField,
  type ContactInput,
  type ContactState,
} from "@/lib/contact";
import { connectToDatabase } from "@/lib/db/connect";
import { Message } from "@/lib/db/models";

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

async function saveMessage(input: ContactInput): Promise<boolean> {
  try {
    await connectToDatabase();
    await Message.create(input);
    return true;
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return false;
  }
}

/** Email is optional: without Resend configured, the dashboard inbox is enough. */
async function emailMessage({ name, email, message }: ContactInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return false;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (error) console.error("Failed to email contact message:", error);
    return !error;
  } catch (error) {
    console.error("Failed to email contact message:", error);
    return false;
  }
}

export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Bots fill every field; pretend it worked so they don't retry.
  if (String(formData.get(HONEYPOT_FIELD) ?? "") !== "") {
    return { status: "success", message: "Thanks! Your message has been sent." };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      errors[field] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  const [saved, emailed] = await Promise.all([saveMessage(parsed.data), emailMessage(parsed.data)]);

  if (!saved && !emailed) {
    return {
      status: "error",
      message: "Something went wrong while sending your message. Please try again.",
      values,
    };
  }

  return { status: "success", message: "Thanks! Your message has been sent." };
}
