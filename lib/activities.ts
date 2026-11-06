import type { LightboxImage } from "@/components/ui/lightbox";
import type { ActivityItem } from "@/lib/content";
import { activityTypes, type ActivityData } from "@/lib/schemas";

export type ActivityType = ActivityData["type"];

export const activityTabLabels: Record<ActivityType, string> = {
  competition: "competitions",
  volunteering: "volunteering",
  community: "community",
  talk: "talks",
  certificate: "certificates",
  design: "design",
};

const HOME_LIMIT = 3;

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatMonth(date: string): string {
  return monthYear.format(new Date(`${date}T00:00:00Z`));
}

export function formatActivityDates({ startDate, endDate }: ActivityItem): string {
  const start = formatMonth(startDate);
  const end = endDate ? formatMonth(endDate) : start;
  return start === end ? start : `${start} – ${end}`;
}

export function isActivityType(value: string | null): value is ActivityType {
  return activityTypes.includes(value as ActivityType);
}

/** Types with at least one item, in the order they're declared. */
export function usedActivityTypes(items: readonly ActivityItem[]): ActivityType[] {
  return activityTypes.filter((type) => items.some((item) => item.type === type));
}

/** Featured items first choice; a type with none still shows its latest entries. */
export function pickForHome(items: readonly ActivityItem[]): ActivityItem[] {
  const featured = items.filter((item) => item.featured);
  return (featured.length > 0 ? featured : items).slice(0, HOME_LIMIT);
}

export function activityImages({ title, coverImage, gallery }: ActivityItem): LightboxImage[] {
  const images = gallery.map(({ image, alt }) => ({ src: image, alt }));
  const coverInGallery = images.some(({ src }) => src === coverImage);
  return coverImage && !coverInGallery ? [{ src: coverImage, alt: title }, ...images] : images;
}

export function activityKey({ title, startDate }: ActivityItem): string {
  return `${title}-${startDate}`;
}
