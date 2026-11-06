"use client";

import { useState } from "react";
import { projectLinkTypes, projectLinkVariants } from "@/lib/schemas";
import type { ProjectLink } from "@/lib/project-links";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "./confirm-button";
import { SelectField, TextField } from "./fields";
import { SortableList } from "./sortable-list";

type Row = ProjectLink & { id: string };

type LinksFieldProps = {
  value: ProjectLink[];
  /** Validation errors for the whole form, keyed like `links.2.url`. */
  errors: Record<string, string>;
  /** SVG markup per type, resolved on the server to keep icon data out of the bundle. */
  icons: Record<ProjectLink["type"], string>;
  onChange: (value: ProjectLink[]) => void;
};

const NEW_LINK: ProjectLink = {
  label: "",
  url: "",
  type: "other",
  variant: "secondary",
  group: "",
  order: 0,
};

export function LinksField({ value, errors, icons, onChange }: LinksFieldProps) {
  const [rows, setRows] = useState<Row[]>(() =>
    value.map((link) => ({ ...link, id: crypto.randomUUID() })),
  );

  function update(next: Row[]) {
    setRows(next);
    onChange(
      next.map(({ label, url, type, variant, group }, order) => ({
        label,
        url,
        type,
        variant,
        group,
        order,
      })),
    );
  }

  function patch(id: string, change: Partial<ProjectLink>) {
    update(rows.map((row) => (row.id === id ? { ...row, ...change } : row)));
  }

  return (
    <fieldset className="flex flex-col gap-3 border border-line p-4">
      <legend className="px-1 text-white">Links</legend>

      {rows.length > 0 && (
        <SortableList items={rows} label="link" onReorder={update}>
          {(row) => {
            const index = rows.indexOf(row);
            return (
              <div className="flex flex-col gap-2">
                <div className="grid items-start gap-2 sm:grid-cols-2">
                  <TextField
                    id={`link-${row.id}-label`}
                    label="Label"
                    value={row.label}
                    error={errors[`links.${index}.label`]}
                    onChange={(label) => patch(row.id, { label })}
                  />
                  <TextField
                    id={`link-${row.id}-url`}
                    label="URL"
                    value={row.url}
                    error={errors[`links.${index}.url`]}
                    onChange={(url) => patch(row.id, { url })}
                  />
                  <SelectField
                    id={`link-${row.id}-type`}
                    label="Type"
                    value={row.type}
                    options={projectLinkTypes}
                    onChange={(type) => patch(row.id, { type: type as ProjectLink["type"] })}
                  />
                  <SelectField
                    id={`link-${row.id}-variant`}
                    label="Style"
                    value={row.variant}
                    options={projectLinkVariants}
                    onChange={(variant) =>
                      patch(row.id, { variant: variant as ProjectLink["variant"] })
                    }
                  />
                  <TextField
                    id={`link-${row.id}-group`}
                    label="Group (optional)"
                    value={row.group}
                    error={errors[`links.${index}.group`]}
                    onChange={(group) => patch(row.id, { group })}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                    className="size-5 text-white"
                    dangerouslySetInnerHTML={{ __html: icons[row.type] }}
                  />
                  <ConfirmButton
                    title="Remove this link?"
                    description={row.label || row.url || "This empty link will be removed."}
                    confirmLabel="Remove"
                    onConfirm={() => update(rows.filter(({ id }) => id !== row.id))}
                  >
                    Remove
                  </ConfirmButton>
                </div>
              </div>
            );
          }}
        </SortableList>
      )}

      {errors.links && <p className="text-sm text-primary">{errors.links}</p>}

      <Button
        variant="secondary"
        className="w-fit"
        onClick={() => update([...rows, { ...NEW_LINK, id: crypto.randomUUID() }])}
      >
        Add link
      </Button>
    </fieldset>
  );
}
