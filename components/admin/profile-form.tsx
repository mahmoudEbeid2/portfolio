"use client";

import { useState } from "react";
import { saveProfile } from "@/lib/admin/actions/profile";
import type { ProfileData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { CheckboxField, ImageField, TextareaField, TextField } from "./fields";
import { useAction } from "./use-action";

function splitBlocks(value: string, separator: RegExp): string[] {
  return value
    .split(separator)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [values, setValues] = useState(profile);
  const [roles, setRoles] = useState(profile.roles.join("\n"));
  const [bio, setBio] = useState(profile.bio.join("\n\n"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending, run } = useAction();

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const input = {
      ...values,
      roles: splitBlocks(roles, /\n/),
      bio: splitBlocks(bio, /\n\s*\n/),
    };
    run(
      () => saveProfile(input),
      (result) => setErrors(result.ok ? {} : (result.fieldErrors ?? {})),
    );
  }

  const text = (
    key: "name" | "fullName" | "tagline" | "currentProject" | "location" | "email",
  ) => ({
    id: `profile-${key}`,
    value: values[key],
    error: errors[key],
    onChange: (value: string) => set(key, value),
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Short name" {...text("name")} />
        <TextField label="Full name" {...text("fullName")} />
        <TextField label="Email" {...text("email")} />
        <TextField label="Location" {...text("location")} />
        <TextField label="Currently working on" {...text("currentProject")} />
        <TextField label="Footer tagline" {...text("tagline")} />
      </div>
      <TextareaField
        id="profile-roles"
        label="Highlighted roles"
        hint="One per line. Shown in the accent color in the hero."
        rows={3}
        value={roles}
        error={errors.roles}
        onChange={setRoles}
      />
      <TextareaField
        id="profile-headline"
        label="Headline"
        rows={2}
        value={values.headline}
        error={errors.headline}
        onChange={(value) => set("headline", value)}
      />
      <TextareaField
        id="profile-bio"
        label="Bio"
        hint="Separate paragraphs with a blank line."
        rows={10}
        value={bio}
        error={errors.bio}
        onChange={setBio}
      />
      <TextareaField
        id="profile-contact-text"
        label="Contact section text"
        rows={3}
        value={values.contactText}
        error={errors.contactText}
        onChange={(value) => set("contactText", value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageField
          id="profile-photo"
          label="Hero photo"
          value={values.photo ?? ""}
          error={errors.photo}
          onChange={(value) => set("photo", value || null)}
        />
        <ImageField
          id="profile-about-photo"
          label="About photo"
          value={values.aboutPhoto ?? ""}
          error={errors.aboutPhoto}
          onChange={(value) => set("aboutPhoto", value || null)}
        />
      </div>
      <TextField
        id="profile-cv"
        label="CV URL"
        value={values.cvUrl ?? ""}
        error={errors.cvUrl}
        hint="A link, or the path of a file in public/. CV uploads arrive with Cloudinary."
        onChange={(value) => set("cvUrl", value || null)}
      />
      <CheckboxField
        id="profile-available"
        label="Available for work"
        checked={values.availableForWork}
        onChange={(value) => set("availableForWork", value)}
      />
      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
