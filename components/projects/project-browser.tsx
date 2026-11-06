"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { chipClasses } from "@/components/ui/chip-classes";
import { Tabs } from "@/components/ui/tabs";
import {
  ALL_PROJECTS,
  parseProjectCategory,
  projectsUrl,
  projectTabs,
  type ProjectCategory,
} from "@/lib/project-filters";

export type BrowserProject = {
  slug: string;
  category: ProjectCategory;
  isOpenSource: boolean;
  featured: boolean;
  card: ReactNode;
};

type ViewProps = {
  projects: BrowserProject[];
  category: ProjectCategory | null;
  openSourceOnly: boolean;
};

function ProjectList({ items }: { items: BrowserProject[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ slug, card }) => (
        <li key={slug}>{card}</li>
      ))}
    </ul>
  );
}

function BrowserView({ projects, category, openSourceOnly }: ViewProps) {
  const matchingToggle = openSourceOnly ? projects.filter((p) => p.isOpenSource) : projects;
  const visible = category ? matchingToggle.filter((p) => p.category === category) : matchingToggle;
  const featured = visible.filter((project) => project.featured);
  const others = visible.filter((project) => !project.featured);

  // pushState updates useSearchParams and back/forward, without a request to the server.
  function go(nextCategory: ProjectCategory | null, nextOpenSource: boolean) {
    window.history.pushState(null, "", projectsUrl(nextCategory, nextOpenSource));
  }

  return (
    <Tabs
      label="Project categories"
      tabs={projectTabs(matchingToggle, category)}
      activeKey={category ?? ALL_PROJECTS}
      onSelect={(key) => go(parseProjectCategory(key), openSourceOnly)}
      extra={
        <button
          type="button"
          aria-pressed={openSourceOnly}
          onClick={() => go(category, !openSourceOnly)}
          className={chipClasses(openSourceOnly)}
        >
          Open source
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        {featured.length > 0 && <ProjectList items={featured} />}
        {others.length > 0 && <ProjectList items={others} />}
        {visible.length === 0 && <p>No projects match these filters.</p>}
      </div>
    </Tabs>
  );
}

function FilteredView({ projects }: { projects: BrowserProject[] }) {
  const params = useSearchParams();

  return (
    <BrowserView
      projects={projects}
      category={parseProjectCategory(params.get("category"))}
      openSourceOnly={params.get("oss") === "1"}
    />
  );
}

/** The page is static, so the prerendered HTML lists everything and the URL filters it here. */
export function ProjectBrowser({ projects }: { projects: BrowserProject[] }) {
  return (
    <Suspense fallback={<BrowserView projects={projects} category={null} openSourceOnly={false} />}>
      <FilteredView projects={projects} />
    </Suspense>
  );
}
