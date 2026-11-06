"use client";

import { useOptimistic, useState } from "react";
import { deleteItem, reorderItems, saveItem } from "@/lib/admin/actions/collections";
import {
  collections,
  type CollectionConfig,
  type CollectionKey,
  type FieldConfig,
} from "@/lib/admin/collections";
import type { AdminItem } from "@/lib/admin/types";
import type { SkillItem } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "./confirm-button";
import { SelectField, TextareaField, TextField } from "./fields";
import { SkillsField } from "./skills-field";
import { SortableList } from "./sortable-list";
import { useAction } from "./use-action";

type FormValues = Record<string, string | SkillItem[]>;

function toForm(fields: readonly FieldConfig[], item?: AdminItem): FormValues {
  return Object.fromEntries(
    fields.map(({ name, kind, options }) => {
      const value = item?.[name];
      if (kind === "skills") return [name, (value ?? []) as SkillItem[]];
      if (Array.isArray(value)) return [name, value.join("\n")];
      return [name, value ?? options?.[0] ?? ""];
    }),
  );
}

function toInput(fields: readonly FieldConfig[], values: FormValues) {
  return Object.fromEntries(
    fields.map(({ name, kind }) => {
      const value = values[name] ?? "";
      if (typeof value !== "string") return [name, value];
      if (kind !== "lines") return [name, value];
      return [
        name,
        value
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      ];
    }),
  );
}

type ItemFormProps = {
  collection: CollectionKey;
  config: CollectionConfig;
  item?: AdminItem;
  onClose: () => void;
};

function ItemForm({ collection, config, item, onClose }: ItemFormProps) {
  const [values, setValues] = useState(() => toForm(config.fields, item));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending, run } = useAction();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    run(
      () => saveItem(collection, item?.id ?? null, toInput(config.fields, values)),
      (result) => {
        if (result.ok) onClose();
        else setErrors(result.fieldErrors ?? {});
      },
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 border border-primary p-4">
      {config.fields.map(({ name, label, kind, hint, options }) => {
        const value = values[name] ?? "";
        const id = `${collection}-${item?.id ?? "new"}-${name}`;
        const onChange = (next: string | SkillItem[]) =>
          setValues((current) => ({ ...current, [name]: next }));

        if (typeof value !== "string")
          return (
            <SkillsField key={name} id={id} value={value} errors={errors} onChange={onChange} />
          );

        const shared = { id, label, hint, error: errors[name], value, onChange };
        if (kind === "select")
          return <SelectField key={name} {...shared} options={options ?? []} />;
        if (kind === "text") return <TextField key={name} {...shared} />;
        return <TextareaField key={name} {...shared} />;
      })}
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

type CollectionEditorProps = {
  collection: CollectionKey;
  items: AdminItem[];
};

export function CollectionEditor({ collection, items }: CollectionEditorProps) {
  const config: CollectionConfig = collections[collection];
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);
  const { pending, run } = useAction();

  function reorder(next: AdminItem[]) {
    run(() => {
      setOptimisticItems(next);
      return reorderItems(
        collection,
        next.map(({ id }) => id),
      );
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <SortableList
        items={optimisticItems}
        label={config.noun}
        disabled={pending || editing !== null}
        onReorder={reorder}
      >
        {(item) =>
          editing === item.id ? (
            <ItemForm
              collection={collection}
              config={config}
              item={item}
              onClose={() => setEditing(null)}
            />
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-white">{config.title(item)}</p>
                {config.subtitle && <p className="break-words text-sm">{config.subtitle(item)}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(item.id)}>
                  Edit
                </Button>
                <ConfirmButton
                  title={`Delete this ${config.noun}?`}
                  description={config.title(item)}
                  disabled={pending}
                  onConfirm={() => run(() => deleteItem(collection, item.id))}
                >
                  Delete
                </ConfirmButton>
              </div>
            </div>
          )
        }
      </SortableList>

      {items.length === 0 && <p>Nothing here yet.</p>}

      {editing === "new" ? (
        <ItemForm collection={collection} config={config} onClose={() => setEditing(null)} />
      ) : (
        <Button className="w-fit" onClick={() => setEditing("new")}>
          Add {config.noun}
        </Button>
      )}
    </div>
  );
}
