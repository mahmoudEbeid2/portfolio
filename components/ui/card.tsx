import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li" | "section";
};

export function Card({ as: Tag = "div", className, ...props }: CardProps) {
  return <Tag className={cn("flex flex-col border border-gray", className)} {...props} />;
}
