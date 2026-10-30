import Link from "next/link";
import { cn } from "@/lib/cn";

type SectionTitleProps = {
  /** Title text without the prefix, e.g. "projects". */
  name: string;
  /** Character shown in primary before the name. */
  prefix?: "#" | "/";
  as?: "h1" | "h2" | "h3";
  /** Draws the horizontal primary line after the title. */
  line?: boolean;
  viewAllHref?: string;
  id?: string;
  className?: string;
};

export function SectionTitle({
  name,
  prefix = "#",
  as: Heading = "h2",
  line = true,
  viewAllHref,
  id,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Heading id={id} className="text-2xl font-medium whitespace-nowrap sm:text-[32px]">
        <span className="text-primary">{prefix}</span>
        {name}
      </Heading>
      {line && <span aria-hidden="true" className="h-px max-w-128 flex-1 bg-primary" />}
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="ml-auto whitespace-nowrap text-white transition-colors hover:text-primary"
        >
          View all ~~&gt;
        </Link>
      )}
    </div>
  );
}
