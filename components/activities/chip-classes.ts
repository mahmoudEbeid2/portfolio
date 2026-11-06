import { cn } from "@/lib/cn";

/** Shared look of the home tabs and the activities page filter. */
export function chipClasses(active: boolean): string {
  return cn(
    "inline-flex min-h-11 items-center border px-3 transition-colors hover:text-white",
    active ? "border-primary text-white" : "border-gray text-gray",
  );
}
