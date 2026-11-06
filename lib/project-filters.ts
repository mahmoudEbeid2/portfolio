import type { Project } from "@/lib/content";
import { projectCategories } from "@/lib/schemas";

export type ProjectCategory = Project["category"];

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  "full-stack": "Full-stack",
  backend: "Backend",
  frontend: "Frontend",
  mobile: "Mobile",
  library: "Library",
};

const projectTabLabels: Record<ProjectCategory, string> = {
  ...projectCategoryLabels,
  library: "Libraries",
};

const HOME_LIMIT = 3;

export const ALL_PROJECTS = "all";

type FilterableProject = { category: ProjectCategory };

export function parseProjectCategory(value: string | null): ProjectCategory | null {
  return projectCategories.find((category) => category === value) ?? null;
}

/** The URL for a filter, so every state can be shared and reached with the back button. */
export function projectsUrl(category: ProjectCategory | null, openSourceOnly: boolean): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (openSourceOnly) params.set("oss", "1");
  const query = params.toString();
  return query ? `/projects?${query}` : "/projects";
}

/** "All" plus each category with a count, leaving out empty ones unless `keep` is selected. */
export function projectTabs<T extends FilterableProject>(
  projects: readonly T[],
  keep: ProjectCategory | null = null,
) {
  const countOf = (category: ProjectCategory) =>
    projects.filter((project) => project.category === category).length;

  return [
    { key: ALL_PROJECTS, label: `All (${projects.length})` },
    ...projectCategories
      .filter((category) => countOf(category) > 0 || category === keep)
      .map((category) => ({
        key: category,
        label: `${projectTabLabels[category]} (${countOf(category)})`,
      })),
  ];
}

/** Featured projects first, then the rest in their saved order. */
export function pickTopProjects(projects: readonly Project[]): Project[] {
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);
  return [...featured, ...others].slice(0, HOME_LIMIT);
}
