import type { ReactNode } from "react";
import { DotGrid } from "@/components/ui/dot-grid";
import { OutlineSquare } from "@/components/ui/outline-square";
import { cn } from "@/lib/cn";

type FrameProps = {
  children: ReactNode;
  className?: string;
};

/** The outline squares and dot grid that sit around a hero or section visual. */
export function SectionMarkFrame({ children, className }: FrameProps) {
  return (
    <div className={cn("relative p-8", className)}>
      <OutlineSquare size={140} tone="primary" className="absolute top-0 left-0" />
      <OutlineSquare size={96} tone="primary" className="absolute right-0 bottom-0" />
      <DotGrid cols={5} rows={5} className="absolute right-12 bottom-14 z-10" />
      {children}
    </div>
  );
}

type SectionMarkProps = {
  /** An inline SVG that fills its box and draws with `currentColor`. */
  children: ReactNode;
  /** Makes the mark a link. Without it the mark is decorative. */
  link?: { href: string; label: string };
  className?: string;
};

const markClasses = "section-mark relative block w-[min(280px,78%)] text-gray hover:text-primary";

/** A large icon with a soft glow and a slow float, framed like the hero visual. */
export function SectionMark({ children, link, className }: SectionMarkProps) {
  const content = (
    <>
      <span aria-hidden="true" className="section-mark-glow absolute -inset-6" />
      {children}
    </>
  );

  return (
    <SectionMarkFrame className={className}>
      <div className="relative flex aspect-square w-full items-center justify-center">
        {link ? (
          <a
            href={link.href}
            aria-label={link.label}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(markClasses, "focus-visible:text-primary")}
          >
            {content}
          </a>
        ) : (
          <div aria-hidden="true" className={markClasses}>
            {content}
          </div>
        )}
      </div>
    </SectionMarkFrame>
  );
}

/** Size for marks beside section content: about 180px stacked, 280px side by side. */
export const sectionMarkSize = "w-full max-w-[295px] shrink-0 lg:max-w-[423px]";
