import type { ProjectData } from "@/lib/schemas";

export type ProjectLink = ProjectData["links"][number];

/** A project counts as live when it has a demo link. */
export function isLive(links: readonly ProjectLink[]): boolean {
  return links.some(({ type }) => type === "demo");
}

export function hasGitHubLink(links: readonly ProjectLink[]): boolean {
  return links.some(({ type, url }) => type === "github" && url.trim() !== "");
}

/** What a project card shows: the first primary link, then GitHub. */
export function cardLinks(links: readonly ProjectLink[]): ProjectLink[] {
  const primary = links.find(({ variant }) => variant === "primary");
  const github = links.find(({ type }) => type === "github");
  return [...new Set([primary, github])].filter((link) => link !== undefined);
}

type LinkGroup = { name: string; links: ProjectLink[] };

/** Groups links by name in the order they first appear. Ungrouped links have an empty name. */
export function groupLinks(links: readonly ProjectLink[]): LinkGroup[] {
  const groups = new Map<string, ProjectLink[]>();
  for (const link of links) groups.set(link.group, [...(groups.get(link.group) ?? []), link]);
  return [...groups].map(([name, grouped]) => ({ name, links: grouped }));
}
