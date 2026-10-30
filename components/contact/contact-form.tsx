"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/app/(site)/contacts/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { HONEYPOT_FIELD, initialContactState, type ContactField } from "@/lib/contact";

const inputClasses =
  "w-full border border-gray bg-transparent p-2 text-white placeholder:text-gray/70 focus:border-primary focus:outline-none focus-visible:outline-2 aria-invalid:border-primary";

type FieldProps = {
  name: ContactField;
  label: string;
  error?: string;
  defaultValue?: string;
  type?: "text" | "email";
  autoComplete?: string;
  multiline?: boolean;
};

function Field({
  name,
  label,
  error,
  defaultValue,
  type = "text",
  autoComplete,
  multiline,
}: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    required: true,
    defaultValue,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <div className={cn("flex flex-col gap-2", multiline && "sm:col-span-2")}>
      <label htmlFor={id} className="text-white">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} className={cn(inputClasses, "resize-y")} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          className={cn(inputClasses, "min-h-11")}
        />
      )}
      {error && (
        <p id={errorId} className="text-primary">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);
  const { errors, values } = state;

  return (
    <form action={formAction} noValidate className="grid gap-6 sm:grid-cols-2">
      <Field
        name="name"
        label="Name"
        autoComplete="name"
        error={errors?.name}
        defaultValue={values?.name}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors?.email}
        defaultValue={values?.email}
      />
      <Field
        name="message"
        label="Message"
        multiline
        error={errors?.message}
        defaultValue={values?.message}
      />

      {/* Honeypot: hidden from people and assistive tech, filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>Company</label>
        <input
          id={`contact-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col items-start gap-4 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send message"}
        </Button>
        <p
          role="status"
          aria-live="polite"
          className={cn(
            state.status === "success" ? "text-white" : "text-primary",
            !state.message && "sr-only",
          )}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
