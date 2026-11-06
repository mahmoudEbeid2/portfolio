"use client";

import Link from "next/link";
import { useOptimistic, useState } from "react";
import {
  deleteActivity,
  reorderActivities,
  setActivityFeatured,
  setActivityStatus,
} from "@/lib/admin/actions/activities";
import type { AdminActivity } from "@/lib/admin/types";
import { activityTypes } from "@/lib/schemas";
import { Button, buttonClasses } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { ConfirmButton } from "./confirm-button";
import { SelectField } from "./fields";
import { mergeReorder, SortableList } from "./sortable-list";
import { useAction } from "./use-action";

const ALL = "all";

export function ActivityList({ activities }: { activities: AdminActivity[] }) {
  const [optimistic, setOptimistic] = useOptimistic(activities);
  const [filter, setFilter] = useState<string>(ALL);
  const { pending, run } = useAction();

  const visible = filter === ALL ? optimistic : optimistic.filter(({ type }) => type === filter);

  function reorder(next: AdminActivity[]) {
    const full = mergeReorder(optimistic, next, ({ type }) => filter === ALL || type === filter);
    run(() => {
      setOptimistic(full);
      return reorderActivities(full.map(({ id }) => id));
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-64">
        <SelectField
          id="activity-filter"
          label="Type"
          value={filter}
          options={[ALL, ...activityTypes]}
          onChange={setFilter}
        />
      </div>

      {visible.length === 0 && <p>Nothing here yet.</p>}

      <SortableList items={visible} label="activity" disabled={pending} onReorder={reorder}>
        {(activity) => (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/admin/activities/${activity.id}`}
                className="text-white hover:text-primary"
              >
                {activity.title}
              </Link>
              <Tag>{activity.type}</Tag>
              {activity.status === "draft" && <Tag className="border-primary">draft</Tag>}
              {activity.featured && <Tag className="border-primary">featured</Tag>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/activities/${activity.id}`}
                className={buttonClasses("secondary")}
              >
                Edit
              </Link>
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() => run(() => setActivityFeatured(activity.id, !activity.featured))}
              >
                {activity.featured ? "Unfeature" : "Feature"}
              </Button>
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() =>
                  run(() =>
                    setActivityStatus(
                      activity.id,
                      activity.status === "published" ? "draft" : "published",
                    ),
                  )
                }
              >
                {activity.status === "published" ? "Unpublish" : "Publish"}
              </Button>
              <ConfirmButton
                title="Delete this activity?"
                description={`"${activity.title}" will be removed permanently.`}
                disabled={pending}
                onConfirm={() => run(() => deleteActivity(activity.id))}
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
