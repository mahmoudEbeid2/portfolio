"use server";

import { Resend } from "resend";
import { contactSchema, HONEYPOT_FIELD, type ContactField, type ContactState } from "@/lib/contact";

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form is not configured: RESEND_API_KEY or CONTACT_TO_EMAIL is missing.");
    return {
      status: "error",
      message: "The contact form isn't available right now. Please email me directly.",
      values,
    };
  }

  const { name, email, message } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
    to,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Failed to send contact message:", error);
    return {
      status: "error",
      message: "Something went wrong while sending your message. Please try again.",
      values,
    };
  }

  return { status: "success", message: "Thanks! Your message has been sent." };
}
