import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const SPACING = 16;

type DotGridProps = {
  cols: number;
  rows: number;
  className?: string;
};

/** Decorative grid of gray dots on a 16px spacing. */
export function DotGrid({ cols, rows, className }: DotGridProps) {
  const style: CSSProperties = {
    width: cols * SPACING,
    height: rows * SPACING,
    backgroundImage: "radial-gradient(circle, var(--color-gray) 2px, transparent 2.5px)",
    backgroundSize: `${SPACING}px ${SPACING}px`,
  };

  return <div aria-hidden="true" className={cn("decor pointer-events-none", className)} style={style} />;
}
