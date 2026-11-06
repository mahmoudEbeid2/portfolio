import { AboutPhoto } from "@/components/sections/about-photo";
import { CoffeeMark } from "@/components/sections/coffee-mark";
import { getActivity } from "@/lib/activity";
import type { Profile } from "@/lib/content";
import { ActivityPanel } from "./activity-panel";

/** An uploaded about photo, else the live activity panel, else the coffee mark. */
export async function AboutVisual({ profile }: { profile: Profile }) {
  const { aboutPhoto, fullName } = profile;
  if (aboutPhoto) return <AboutPhoto src={aboutPhoto} alt={fullName} />;

  const activity = await getActivity(profile);
  if (!activity.calendar && activity.stats.length === 0) {
    return <CoffeeMark className="order-first lg:order-none" />;
  }
  return <ActivityPanel activity={activity} />;
}
