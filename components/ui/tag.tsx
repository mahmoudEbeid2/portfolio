import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return <span className={cn("inline-block border border-gray px-2 py-1", className)}>{children}</span>;
}
