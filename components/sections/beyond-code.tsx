import { ActivityCard } from "@/components/activities/activity-card";
import { ActivityTabs } from "@/components/activities/activity-tabs";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { activityKey, activityTabLabels, pickForHome, usedActivityTypes } from "@/lib/activities";
import type { ActivityItem } from "@/lib/content";

function ActivityGrid({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={activityKey(item)}>
          <ActivityCard activity={item} />
        </li>
      ))}
    </ul>
  );
}

export function BeyondCode({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) return null;

  const tabs = [
    { key: "all", label: "all", panel: <ActivityGrid items={pickForHome(activities)} /> },
    ...usedActivityTypes(activities).map((type) => ({
      key: type,
      label: activityTabLabels[type],
      panel: <ActivityGrid items={pickForHome(activities.filter((item) => item.type === type))} />,
    })),
  ];

  return (
    <section aria-labelledby="beyond-code" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="beyond-code" name="beyond-code" viewAllHref="/activities" />
        <ActivityTabs tabs={tabs} />
      </Container>
    </section>
  );
}
