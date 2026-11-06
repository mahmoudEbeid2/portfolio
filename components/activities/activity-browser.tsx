"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { chipClasses } from "@/components/ui/chip-classes";
import { activityTabLabels, isActivityType, type ActivityType } from "@/lib/activities";
import { activityTypes } from "@/lib/schemas";

export type BrowserItem = {
  key: string;
  type: ActivityType;
  card: ReactNode;
};

type ViewProps = {
  items: BrowserItem[];
  selected: ActivityType | null;
};

function BrowserView({ items, selected }: ViewProps) {
  const types = activityTypes.filter((type) => items.some((item) => item.type === type));
  const visible = selected ? items.filter(({ type }) => type === selected) : items;

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label="Filter by type">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/activities"
              scroll={false}
              aria-current={selected ? undefined : "true"}
              className={chipClasses(!selected)}
            >
              all
            </Link>
          </li>
          {types.map((type) => (
            <li key={type}>
              <Link
                href={`/activities?type=${type}`}
                scroll={false}
                aria-current={selected === type ? "true" : undefined}
                className={chipClasses(selected === type)}
              >
                {activityTabLabels[type]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ key, card }) => (
          <li key={key}>{card}</li>
        ))}
      </ul>
    </div>
  );
}

function FilteredView({ items }: { items: BrowserItem[] }) {
  const type = useSearchParams().get("type");
  const used = items.some((item) => item.type === type);
  return <BrowserView items={items} selected={isActivityType(type) && used ? type : null} />;
}

/** The page is static, so the prerendered HTML lists everything and the URL filters it here. */
export function ActivityBrowser({ items }: { items: BrowserItem[] }) {
  return (
    <Suspense fallback={<BrowserView items={items} selected={null} />}>
      <FilteredView items={items} />
    </Suspense>
  );
}
