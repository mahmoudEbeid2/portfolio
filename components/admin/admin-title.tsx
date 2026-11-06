import type { ReactNode } from "react";

type AdminTitleProps = { title: string; description?: string; action?: ReactNode };

export function AdminTitle({ title, description, action }: AdminTitleProps) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-medium">
          <span className="text-primary">#</span>
          {title}
        </h1>
        {description && <p className="mt-1">{description}</p>}
      </div>
      {action}
    </header>
  );
}
