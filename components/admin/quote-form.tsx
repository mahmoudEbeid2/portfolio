"use client";

import { useState } from "react";
import { saveQuote } from "@/lib/admin/actions/profile";
import type { QuoteData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { TextField } from "./fields";
import { useAction } from "./use-action";

export function QuoteForm({ quote }: { quote: QuoteData }) {
  const [values, setValues] = useState(quote);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { pending, run } = useAction();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    run(
      () => saveQuote(values),
      (result) => setErrors(result.ok ? {} : (result.fieldErrors ?? {})),
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField
        id="quote-text"
        label="Text"
        value={values.text}
        error={errors.text}
        onChange={(text) => setValues((current) => ({ ...current, text }))}
      />
      <TextField
        id="quote-author"
        label="Author"
        value={values.author}
        error={errors.author}
        onChange={(author) => setValues((current) => ({ ...current, author }))}
      />
      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? "Saving..." : "Save quote"}
      </Button>
    </form>
  );
}
