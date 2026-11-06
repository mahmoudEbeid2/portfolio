import { SectionMark, sectionMarkSize } from "@/components/ui/section-mark";
import { cn } from "@/lib/cn";

const STEAM_LINES = [6, 10, 14];

/** The Lucide "coffee" cup (ISC), with drawn steam in place of its three short lines. */
function CoffeeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="relative block aspect-square w-full overflow-visible"
    >
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      {STEAM_LINES.map((x) => (
        <path
          key={x}
          d={`M${x} 6c-.9-.8-.9-1.7 0-2.5s.9-1.7 0-2.5`}
          strokeWidth="1"
          className="coffee-steam"
        />
      ))}
    </svg>
  );
}

export function CoffeeMark({ className }: { className?: string }) {
  return (
    <SectionMark className={cn(sectionMarkSize, "mx-auto", className)}>
      <CoffeeIcon />
    </SectionMark>
  );
}
