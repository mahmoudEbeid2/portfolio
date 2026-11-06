"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

/** Icon and label switch through CSS, so the server markup matches any stored theme. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="flex size-11 items-center justify-center text-gray transition-colors hover:text-white"
    >
      <span className="sr-only">
        <span className="light:hidden">Switch to light theme</span>
        <span className="hidden light:inline">Switch to dark theme</span>
      </span>
      <SunIcon className="size-6 light:hidden" />
      <MoonIcon className="hidden size-6 light:block" />
    </button>
  );
}
