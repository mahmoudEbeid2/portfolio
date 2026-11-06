"use client";

import { useEffect, useState } from "react";
import { previewSkillIcons } from "@/lib/admin/actions/skill-icons";
import type { SkillItem } from "@/lib/schemas";
import type { SkillIcon } from "@/lib/skill-icons";
import { Button } from "@/components/ui/button";
import { SkillLabel } from "@/components/ui/skill-label";
import { TextField } from "./fields";
import { SortableList } from "./sortable-list";

type Row = SkillItem & { id: string };

type SkillsFieldProps = {
  id: string;
  value: SkillItem[];
  /** Validation errors for the whole form, keyed like `items.2.icon`. */
  errors: Record<string, string>;
  onChange: (value: SkillItem[]) => void;
};

const PREVIEW_DELAY_MS = 300;

function newRow(item: SkillItem): Row {
  return { ...item, id: crypto.randomUUID() };
}

export function SkillsField({ id, value, errors, onChange }: SkillsFieldProps) {
  const [rows, setRows] = useState(() => value.map(newRow));
  const [previews, setPreviews] = useState<Record<string, SkillIcon | null>>({});

  // One request per pause in typing, however many rows need a preview.
  const missing = [...new Set(rows.map(({ icon }) => icon))]
    .filter((slug) => slug && !(slug in previews))
    .join(" ");

  useEffect(() => {
    if (!missing) return;
    const timer = setTimeout(async () => {
      const found = await previewSkillIcons(missing.split(" "));
      setPreviews((current) => ({ ...current, ...found }));
    }, PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [missing]);

  function update(next: Row[]) {
    setRows(next);
    onChange(next.map(({ name, icon }) => ({ name, icon })));
  }

  function patch(rowId: string, change: Partial<SkillItem>) {
    update(rows.map((row) => (row.id === rowId ? { ...row, ...change } : row)));
  }

  return (
    <fieldset className="flex flex-col gap-3 border border-line p-4">
      <legend className="px-1 text-white">Skills</legend>

      {rows.length > 0 && (
        <SortableList items={rows} label="skill" onReorder={update}>
          {(row) => {
            const index = rows.indexOf(row);
            const notFound = row.icon !== "" && previews[row.icon] === null;

            return (
              <div className="flex flex-col gap-2">
                <div className="grid items-start gap-2 sm:grid-cols-2">
                  <TextField
                    id={`${id}-${row.id}-name`}
                    label="Name"
                    value={row.name}
                    error={errors[`items.${index}.name`]}
                    onChange={(name) => patch(row.id, { name })}
                  />
                  <TextField
                    id={`${id}-${row.id}-icon`}
                    label="Icon"
                    value={row.icon}
                    hint={notFound ? "No icon with this slug: only the name will show." : undefined}
                    error={errors[`items.${index}.icon`]}
                    onChange={(icon) => patch(row.id, { icon: icon.trim().toLowerCase() })}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SkillLabel name={row.name || "Preview"} icon={previews[row.icon] ?? null} />
                  <Button
                    variant="secondary"
                    onClick={() => update(rows.filter(({ id: rowId }) => rowId !== row.id))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          }}
        </SortableList>
      )}

      {errors.items && <p className="text-sm text-primary">{errors.items}</p>}

      <p className="text-sm">
        Icons use{" "}
        <a
          href="https://simpleicons.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline"
        >
          simpleicons.org
        </a>{" "}
        slugs, like nodedotjs. Leave it empty to show only the name.
      </p>

      <Button
        variant="secondary"
        className="w-fit"
        onClick={() => update([...rows, newRow({ name: "", icon: "" })])}
      >
        Add skill
      </Button>
    </fieldset>
  );
}
