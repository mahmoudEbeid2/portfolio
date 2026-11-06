"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { MdxBody } from "@/components/projects/mdx-body";
import { mdxComponents } from "@/components/projects/mdx-components";
import { checkBody } from "@/lib/admin/actions/projects";
import { BodyToolbar } from "./body-toolbar";
import { TextareaField } from "./fields";

type BodyEditorProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const PREVIEW_DELAY_MS = 500;

/** Keeps a block on its own lines, which MDX needs to read it as a component. */
function insertBlock(text: string, snippet: string, start: number, end: number) {
  const before = text.slice(0, start);
  const lead = !before || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const inserted = `${before}${lead}${snippet}\n\n`;
  return { text: `${inserted}${text.slice(end)}`, cursor: inserted.length };
}

export function BodyEditor({ value, error, onChange }: BodyEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<ReactNode>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;

    // Same checks as saving, then the same components as the public page.
    const timer = setTimeout(async () => {
      const problem = await checkBody(value);
      if (stale) return;
      setPreviewError(problem);
      if (problem) return;

      // Loaded on demand so the compiler stays out of the initial bundle.
      const { evaluate } = await import("@mdx-js/mdx");
      const { default: Content } = await evaluate(value, runtime);
      if (stale) return;
      setPreview(
        <MdxBody>
          <Content components={mdxComponents} />
        </MdxBody>,
      );
    }, PREVIEW_DELAY_MS);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [value]);

  function insert(snippet: string) {
    const start = textareaRef.current?.selectionStart ?? value.length;
    const end = textareaRef.current?.selectionEnd ?? value.length;
    const { text, cursor } = insertBlock(value, snippet, start, end);
    onChange(text);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <BodyToolbar onInsert={insert} />
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <TextareaField
          id="project-body"
          label="Body (Markdown / MDX)"
          rows={24}
          value={value}
          error={error}
          textareaRef={textareaRef}
          onChange={onChange}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-white">Preview</p>
          <div className="project-preview max-h-[640px] min-h-40 overflow-auto border border-line p-4">
            {previewError ? (
              <p className="text-sm whitespace-pre-wrap text-primary">{previewError}</p>
            ) : (
              preview
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
