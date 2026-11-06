import octicons from "@primer/octicons";
import { siAppstore, siGithub, siGoogleplay } from "simple-icons";
import type { ProjectLink } from "@/lib/project-links";

function octicon(name: "globe" | "book" | "terminal" | "video" | "download" | "link-external") {
  return octicons[name].heights[24]?.path ?? "";
}

function simpleIcon({ path }: { path: string }): string {
  return `<path d="${path}"/>`;
}

/** SVG markup per link type. Server only: the packages hold every icon. */
export const projectLinkIcons: Record<ProjectLink["type"], string> = {
  demo: octicon("globe"),
  github: simpleIcon(siGithub),
  docs: octicon("book"),
  api: octicon("terminal"),
  appstore: simpleIcon(siAppstore),
  playstore: simpleIcon(siGoogleplay),
  video: octicon("video"),
  download: octicon("download"),
  other: octicon("link-external"),
};
