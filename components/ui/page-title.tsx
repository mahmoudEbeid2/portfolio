import { cn } from "@/lib/cn";

type PageTitleProps = {
  /** Title text without the leading slash, e.g. "projects". */
  name: string;
  subtitle?: string;
  className?: string;
};

export function PageTitle({ name, subtitle, className }: PageTitleProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      <h1 className="text-[32px] font-semibold">
        <span className="text-primary">/</span>
        {name}
      </h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
