import { cn } from "@/lib/cn";

type OutlineSquareProps = {
  size: number;
  tone?: "primary" | "gray";
  className?: string;
};

/** Decorative outlined square. */
export function OutlineSquare({ size, tone = "gray", className }: OutlineSquareProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "decor pointer-events-none border",
        tone === "primary" ? "border-primary" : "border-gray",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
