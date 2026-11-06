"use client";

import Link from "next/link";
import { useOptimistic } from "react";
import {
  deleteProject,
  reorderProjects,
  setProjectFeatured,
  setProjectStatus,
} from "@/lib/admin/actions/projects";
import type { AdminProject } from "@/lib/admin/types";
import { Button, buttonClasses } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { ConfirmButton } from "./confirm-button";
import { SortableList } from "./sortable-list";
import { useAction } from "./use-action";

export function ProjectList({ projects }: { projects: AdminProject[] }) {
  const [optimisticProjects, setOptimisticProjects] = useOptimistic(projects);
  const { pending, run } = useAction();

  function reorder(next: AdminProject[]) {
    run(() => {
      setOptimisticProjects(next);
      return reorderProjects(next.map(({ id }) => id));
    });
  }

  return (
    <SortableList items={optimisticProjects} label="project" disabled={pending} onReorder={reorder}>
      {(project) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/projects/${project.id}`} className="text-white hover:text-primary">
              {project.title}
            </Link>
            <Tag>{project.category}</Tag>
            {project.status === "draft" && <Tag className="border-primary">draft</Tag>}
            {project.featured && <Tag className="border-primary">featured</Tag>}
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
  );
}
