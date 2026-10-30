import { cn } from "@/lib/cn";

type LogoProps = {
  name?: string;
  className?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="0.5" y="0.5" width="9" height="9" />
      <rect x="6.5" y="6.5" width="9" height="9" />
    </svg>
  );
}

export function Logo({ name = "Mahmoud", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold text-white", className)}>
      <LogoMark />
      {name}
    </span>
  );
}
