import * as simpleIcons from "simple-icons";

export type SkillIcon = {
  title: string;
  path: string;
  /** Hover colors per theme. Brands that vanish on a background fall back to `--white`. */
  brandDark: string;
  brandLight: string;
};

type IconData = { title: string; path: string; hex: string };

const icons = simpleIcons as unknown as Record<string, IconData | undefined>;

// Mirrors `--background` in app/globals.css.
const DARK_BACKGROUND = "282c33";
const LIGHT_BACKGROUND = "fafaf7";
const MIN_CONTRAST = 3;

function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [0, 2, 4].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(first: string, second: string): number {
  const [low, high] = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return ((high ?? 0) + 0.05) / ((low ?? 0) + 0.05);
}

function readable(hex: string, background: string): string {
  return contrast(hex, background) >= MIN_CONTRAST ? `#${hex}` : "var(--white)";
}

/** Looks up a simple-icons slug. Server only: the package holds every icon. */
export function getSkillIcon(slug: string): SkillIcon | null {
  if (!slug) return null;

  const icon = icons[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
  if (!icon) return null;

  return {
    title: icon.title,
    path: icon.path,
    brandDark: readable(icon.hex, DARK_BACKGROUND),
    brandLight: readable(icon.hex, LIGHT_BACKGROUND),
  };
}
