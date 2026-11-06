import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { AboutPreview } from "@/components/sections/about-preview";
import { BeyondCode } from "@/components/sections/beyond-code";
import { Contacts } from "@/components/sections/contacts";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { QuoteBlock } from "@/components/sections/quote-block";
import { Skills } from "@/components/sections/skills";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import {
  getActivities,
  getExperience,
  getFeaturedProjects,
  getProfile,
  getQuote,
  getSkills,
} from "@/lib/content";

export default async function HomePage() {
  const [profile, quote, projects, experience, activities, skills] = await Promise.all([
    getProfile(),
    getQuote(),
    getFeaturedProjects(),
    getExperience(),
    getActivities(),
    getSkills(),
  ]);

  return (
    <>
      <PersonJsonLd profile={profile} />
      <Hero profile={profile} />
      <QuoteBlock quote={quote} />
      <FeaturedProjects projects={projects.slice(0, 3)} />
      <ExperienceTimeline items={experience} />
      <BeyondCode activities={activities} />
      <Skills groups={skills} />
      <AboutPreview profile={profile} />
      <Contacts profile={profile} />
    </>
  );
}
