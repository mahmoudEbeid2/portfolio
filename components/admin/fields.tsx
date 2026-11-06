import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Inputs keep the gray border: the lighter `line` token misses AA for boundaries.
export const inputClasses =
  "w-full border border-gray bg-transparent p-2 text-white placeholder:text-gray focus:border-primary focus:outline-none focus-visible:outline-2 aria-invalid:border-primary";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-white">
        {label}
      </label>
      {children}
      {hint && <p className="text-sm">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-sm whitespace-pre-wrap text-primary">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
};

function a11y(id: string, error?: string) {
  return {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

export function TextField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  onBlur,
}: InputProps & { onBlur?: () => void }) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        {...a11y(id, error)}
        type="text"
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        className={inputClasses}
      />
    </FieldShell>
  );
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  rows = 4,
}: InputProps & { rows?: number }) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        {...a11y(id, error)}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputClasses, "resize-y")}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  options,
}: InputProps & { options: readonly string[] }) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        {...a11y(id, error)}
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className={cn(inputClasses, "bg-background")}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

const UPLOADS_DISABLED_HINT =
  "Uploads are disabled until Cloudinary is set up. For now, enter the path of a file in public/.";

/** An image path. Uploads will plug in here once Cloudinary is configured. */
export function ImageField(props: InputProps) {
  return <TextField {...props} hint={props.hint ?? UPLOADS_DISABLED_HINT} />;
}

type CheckboxFieldProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxField({ id, label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className="flex min-h-11 items-center gap-2 text-white">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-primary"
      />
      {label}
    </label>
  );
}
