"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveActivity } from "@/lib/admin/actions/activities";
import { activityTypes, projectStatuses, type ActivityData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { CheckboxField, SelectField, TextareaField, TextField } from "./fields";
import { SortableList } from "./sortable-list";
import { ImageField, UploadButton } from "./upload-field";
import { useAction } from "./use-action";

type ActivityFormProps = { id: string | null; activity: ActivityData };

type GalleryImage = ActivityData["gallery"][number];
type ActivityLink = ActivityData["links"][number];

export function ActivityForm({ id, activity }: ActivityFormProps) {
  const [values, setValues] = useState(activity);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending, run } = useAction();
  const router = useRouter();

  const isCertificate = values.type === "certificate";

  function set<K extends keyof ActivityData>(key: K, value: ActivityData[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  // Functional updates: several uploads can finish from one file selection.
  function addImage(url: string) {
    setValues((current) => ({
      ...current,
      gallery: [...current.gallery, { image: url, alt: "" }],
    }));
  }

  function setImage(index: number, change: Partial<GalleryImage>) {
    set(
      "gallery",
      values.gallery.map((image, i) => (i === index ? { ...image, ...change } : image)),
    );
  }

  function setLink(index: number, change: Partial<ActivityLink>) {
    set(
      "links",
      values.links.map((link, i) => (i === index ? { ...link, ...change } : link)),
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    run(
      () => saveActivity(id, values),
      (result) => {
        setErrors(result.ok ? {} : (result.fieldErrors ?? {}));
        if (result.ok) router.push("/admin/activities");
      },
    );
  }

  const text = (
    key: "title" | "organization" | "role" | "result" | "location",
  ): { id: string; value: string; error?: string; onChange: (value: string) => void } => ({
    id: `activity-${key}`,
    value: values[key],
    error: errors[key],
    onChange: (value) => set(key, value),
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="activity-type"
          label="Type"
          value={values.type}
          options={activityTypes}
          onChange={(value) => set("type", value as ActivityData["type"])}
        />
        <SelectField
          id="activity-status"
          label="Status"
          value={values.status}
          options={projectStatuses}
          onChange={(value) => set("status", value as ActivityData["status"])}
        />
        <TextField label="Title" {...text("title")} />
        <TextField label={isCertificate ? "Issuer" : "Organization"} {...text("organization")} />
        <TextField label={isCertificate ? "Role (optional)" : "Role"} {...text("role")} />
        <TextField
          label="Result (optional)"
          hint="e.g. 3rd place, qualified to finals"
          {...text("result")}
        />
        <TextField label="Location (optional)" {...text("location")} />
        <div className="hidden sm:block" />
        <TextField
          id="activity-start"
          label="Start date"
          type="date"
          value={values.startDate}
          error={errors.startDate}
          onChange={(value) => set("startDate", value)}
        />
        <TextField
          id="activity-end"
          label="End date (optional)"
          type="date"
          value={values.endDate}
          error={errors.endDate}
          onChange={(value) => set("endDate", value)}
        />
        <CheckboxField
          id="activity-featured"
          label="Featured on the home page"
          checked={values.featured}
          onChange={(value) => set("featured", value)}
        />
      </section>

      <TextareaField
        id="activity-description"
        label="Description (Markdown)"
        rows={8}
        value={values.description}
        error={errors.description}
        onChange={(value) => set("description", value)}
      />

      <ImageField
        id="activity-cover"
        label="Cover image"
        kind="activity"
        value={values.coverImage ?? ""}
        error={errors.coverImage}
        onChange={(value) => set("coverImage", value || null)}
      />

      <fieldset className="flex flex-col gap-3 border border-line p-4">
        <legend className="px-1 text-white">Gallery</legend>
        {values.gallery.length > 0 && (
          <SortableList
            items={values.gallery.map((image) => ({ ...image, id: image.image }))}
            label="image"
            onReorder={(next) =>
              set(
                "gallery",
                next.map(({ image, alt }) => ({ image, alt })),
              )
            }
          >
            {(item) => {
              const index = values.gallery.findIndex(({ image }) => image === item.image);
              return (
                <div className="flex flex-wrap items-start gap-3">
                  <span className="relative block aspect-video w-32 shrink-0 border border-line">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-48 flex-1">
                    <TextField
                      id={`activity-gallery-alt-${index}`}
                      label="Alt text"
                      value={item.alt}
                      error={errors[`gallery.${index}.alt`]}
                      onChange={(alt) => setImage(index, { alt })}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      set(
                        "gallery",
                        values.gallery.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              );
            }}
          </SortableList>
        )}
        <div>
          <UploadButton
            id="activity-gallery-upload"
            kind="activity"
            label="Upload images"
            multiple
            onUploaded={addImage}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3 border border-line p-4">
        <legend className="px-1 text-white">Links</legend>
        {isCertificate && <p className="text-sm">The first link becomes the Verify link.</p>}
        {values.links.map((link, index) => (
          <div key={index} className="grid items-start gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <TextField
              id={`activity-link-label-${index}`}
              label="Label"
              value={link.label}
              error={errors[`links.${index}.label`]}
              onChange={(label) => setLink(index, { label })}
            />
            <TextField
              id={`activity-link-url-${index}`}
              label="URL"
              value={link.url}
              error={errors[`links.${index}.url`]}
              onChange={(url) => setLink(index, { url })}
            />
            <Button
              variant="secondary"
              onClick={() =>
                set(
                  "links",
                  values.links.filter((_, i) => i !== index),
                )
              }
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => set("links", [...values.links, { label: "", url: "" }])}
        >
          Add link
        </Button>
      </fieldset>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save activity"}
        </Button>
        <Button variant="secondary" onClick={() => router.push("/admin/activities")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
