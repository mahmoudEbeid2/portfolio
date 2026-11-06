"use client";

import Link from "next/link";
import { useOptimistic, useState } from "react";
import {
  deleteProject,
  reorderProjects,
  setProjectFeatured,
  setProjectStatus,
} from "@/lib/admin/actions/projects";
import type { AdminProject } from "@/lib/admin/types";
import { projectCategories } from "@/lib/schemas";
import { Button, buttonClasses } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { ConfirmButton } from "./confirm-button";
import { SelectField } from "./fields";
import { mergeReorder, SortableList } from "./sortable-list";
import { useAction } from "./use-action";

const ALL = "all";

export function ProjectList({ projects }: { projects: AdminProject[] }) {
  const [optimisticProjects, setOptimisticProjects] = useOptimistic(projects);
  const [filter, setFilter] = useState<string>(ALL);
  const { pending, run } = useAction();

  const visible =
    filter === ALL
      ? optimisticProjects
      : optimisticProjects.filter(({ category }) => category === filter);

  function reorder(next: AdminProject[]) {
    const full = mergeReorder(
      optimisticProjects,
      next,
      ({ category }) => filter === ALL || category === filter,
    );
    run(() => {
      setOptimisticProjects(full);
      return reorderProjects(full.map(({ id }) => id));
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-64">
        <SelectField
          id="project-filter"
          label="Category"
          value={filter}
          options={[ALL, ...projectCategories]}
          onChange={setFilter}
        />
      </div>

      {visible.length === 0 && <p>Nothing here yet.</p>}

      <SortableList items={visible} label="project" disabled={pending} onReorder={reorder}>
        {(project) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/projects/${project.id}`} className="text-white hover:text-primary">
              {project.title}
            </Link>
            {project.status === "draft" && <Tag className="border-primary">draft</Tag>}
            {project.featured && <Tag className="border-primary">featured</Tag>}
            <Tag className="text-center sm:ml-auto sm:w-28">{project.category}</Tag>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/projects/${project.id}`} className={buttonClasses("secondary")}>
              Edit
            </Link>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => run(() => setProjectFeatured(project.id, !project.featured))}
            >
              {project.featured ? "Unfeature" : "Feature"}
            </Button>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() =>
                run(() =>
                  setProjectStatus(
                    project.id,
                    project.status === "published" ? "draft" : "published",
                  ),
                )
              }
            >
              {project.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmButton
              title="Delete this project?"
              description={`"${project.title}" will be removed permanently.`}
              disabled={pending}
              onConfirm={() => run(() => deleteProject(project.id))}
            >
              Delete
            </ConfirmButton>
          </div>
        </div>
        )}
      </SortableList>
    </div>
  );
}
