"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { previewBody, saveProject } from "@/lib/admin/actions/projects";
import { slugify } from "@/lib/admin/slugify";
import { projectCategories, projectStatuses, type ProjectData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { CheckboxField, ImageField, SelectField, TextareaField, TextField } from "./fields";
import { useAction } from "./use-action";

type ProjectFormProps = { id: string | null; project: ProjectData };

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function BodyEditor({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [preview, setPreview] = useState<ReactNode | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pending, startTransition] = useTransition();

  function openPreview() {
    setShowPreview(true);
    startTransition(async () => {
      const result = await previewBody(value);
      setPreview(result.node ?? null);
      setPreviewError(result.error ?? null);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant={showPreview ? "secondary" : "primary"}
          onClick={() => setShowPreview(false)}
        >
          Write
        </Button>
        <Button variant={showPreview ? "primary" : "secondary"} onClick={openPreview}>
          Preview
        </Button>
      </div>
      {showPreview ? (
        <div className="min-h-64 border border-line p-4">
          {pending && <p>Rendering...</p>}
          {!pending && previewError && (
            <p className="whitespace-pre-wrap text-primary">{previewError}</p>
          )}
          {!pending && !previewError && preview}
        </div>
      ) : (
        <TextareaField
          id="project-body"
          label="Body (Markdown / MDX)"
          rows={20}
          value={value}
          error={error}
          onChange={onChange}
        />
      )}
      {showPreview && error && <p className="text-sm text-primary">{error}</p>}
    </div>
  );
}

export function ProjectForm({ id, project }: ProjectFormProps) {
  const [values, setValues] = useState(project);
  const [stack, setStack] = useState(project.stack.join("\n"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending, run } = useAction();
  const router = useRouter();

  function set<K extends keyof ProjectData>(key: K, value: ProjectData[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setLink(key: "demo" | "github", value: string) {
    setValues((current) => ({
      ...current,
      links: { ...current.links, [key]: value || null },
    }));
  }

  function setGallery(index: number, change: Partial<ProjectData["gallery"][number]>) {
    set(
      "gallery",
      values.gallery.map((image, i) => (i === index ? { ...image, ...change } : image)),
    );
  }

  function setOtherLink(index: number, change: Partial<ProjectData["links"]["other"][number]>) {
    set("links", {
      ...values.links,
      other: values.links.other.map((link, i) => (i === index ? { ...link, ...change } : link)),
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    run(
      () => saveProject(id, { ...values, stack: splitLines(stack) }),
      (result) => {
        setErrors(result.ok ? {} : (result.fieldErrors ?? {}));
        if (result.ok) router.push("/admin/projects");
      },
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="project-title"
          label="Title"
          value={values.title}
          error={errors.title}
          onChange={(value) => set("title", value)}
          onBlur={() => {
            if (!values.slug) set("slug", slugify(values.title));
          }}
        />
        <TextField
          id="project-slug"
          label="Slug"
          value={values.slug}
          error={errors.slug}
          hint="Used in the URL: /projects/slug"
          onChange={(value) => set("slug", value)}
        />
        <div className="sm:col-span-2">
          <TextareaField
            id="project-summary"
            label="Summary"
            rows={3}
            value={values.summary}
            error={errors.summary}
            onChange={(value) => set("summary", value)}
          />
        </div>
        <SelectField
          id="project-category"
          label="Category"
          value={values.category}
          options={projectCategories}
          onChange={(value) => set("category", value as ProjectData["category"])}
        />
        <SelectField
          id="project-status"
          label="Status"
          value={values.status}
          options={projectStatuses}
          onChange={(value) => set("status", value as ProjectData["status"])}
        />
        <TextField
          id="project-role"
          label="My role"
          value={values.role}
          error={errors.role}
          onChange={(value) => set("role", value)}
        />
        <TextField
          id="project-timeline"
          label="Timeline"
          value={values.timeline}
          error={errors.timeline}
          hint="e.g. Jan 2025 – Apr 2025"
          onChange={(value) => set("timeline", value)}
        />
        <CheckboxField
          id="project-featured"
          label="Featured on the home page"
          checked={values.featured}
          onChange={(value) => set("featured", value)}
        />
        <CheckboxField
          id="project-team"
          label="Team project"
          checked={values.isTeamProject}
          onChange={(value) => set("isTeamProject", value)}
        />
      </section>

      <TextareaField
        id="project-stack"
        label="Stack"
        hint="One technology per line."
        rows={5}
        value={stack}
        error={errors.stack}
        onChange={setStack}
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="project-demo"
          label="Live demo URL"
          value={values.links.demo ?? ""}
          error={errors["links.demo"]}
          onChange={(value) => setLink("demo", value)}
        />
        <TextField
          id="project-github"
          label="GitHub URL"
          value={values.links.github ?? ""}
          error={errors["links.github"]}
          onChange={(value) => setLink("github", value)}
        />
      </section>

      <fieldset className="flex flex-col gap-3 border border-line p-4">
        <legend className="px-1 text-white">Other links</legend>
        {values.links.other.map((link, index) => (
          <div key={index} className="grid items-end gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <TextField
              id={`project-link-label-${index}`}
              label="Label"
              value={link.label}
              onChange={(label) => setOtherLink(index, { label })}
            />
            <TextField
              id={`project-link-url-${index}`}
              label="URL"
              value={link.url}
              error={errors[`links.other.${index}.url`]}
              onChange={(url) => setOtherLink(index, { url })}
            />
            <Button
              variant="secondary"
              onClick={() =>
                set("links", {
                  ...values.links,
                  other: values.links.other.filter((_, i) => i !== index),
                })
              }
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() =>
            set("links", {
              ...values.links,
              other: [...values.links.other, { label: "", url: "" }],
            })
          }
        >
          Add link
        </Button>
      </fieldset>

      <ImageField
        id="project-cover"
        label="Cover image"
        value={values.cover ?? ""}
        error={errors.cover}
        onChange={(value) => set("cover", value || null)}
      />

      <fieldset className="flex flex-col gap-3 border border-line p-4">
        <legend className="px-1 text-white">Gallery</legend>
        {values.gallery.map((image, index) => (
          <div key={index} className="grid items-end gap-2 sm:grid-cols-[2fr_1fr_auto]">
            <TextField
              id={`project-gallery-image-${index}`}
              label="Image path"
              value={image.image}
              error={errors[`gallery.${index}.image`]}
              onChange={(value) => setGallery(index, { image: value })}
            />
            <TextField
              id={`project-gallery-alt-${index}`}
              label="Alt text"
              value={image.alt}
              onChange={(alt) => setGallery(index, { alt })}
            />
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
        ))}
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => set("gallery", [...values.gallery, { image: "", alt: "" }])}
        >
          Add image
        </Button>
      </fieldset>

      <BodyEditor
        value={values.body}
        error={errors.body}
        onChange={(value) => set("body", value)}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save project"}
        </Button>
        <Button variant="secondary" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
