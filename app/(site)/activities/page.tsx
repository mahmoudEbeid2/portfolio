import type { Metadata } from "next";
import { ActivityBrowser } from "@/components/activities/activity-browser";
import { ActivityCard } from "@/components/activities/activity-card";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import { activityKey } from "@/lib/activities";
import { getActivities } from "@/lib/content";
import { openGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Beyond code",
  description:
    "Competitions, volunteering, community work, talks and certificates of Mahmoud Ebeid.",
  alternates: { canonical: "/activities" },
  openGraph: openGraph("/activities"),
};

export default async function ActivitiesPage() {
  const activities = await getActivities();
  const newestFirst = [...activities].sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <Container className="flex flex-col gap-12 py-12">
      <PageTitle name="beyond-code" subtitle="What I do outside of work" />
      <h2 className="sr-only">Activities</h2>
      {newestFirst.length > 0 ? (
        <ActivityBrowser
          items={newestFirst.map((activity) => ({
            key: activityKey(activity),
            type: activity.type,
            card: <ActivityCard activity={activity} detailed />,
          }))}
        />
      ) : (
        <p>Nothing here yet.</p>
      )}
    </Container>
  );
}
