import { AboutPreview } from "@/components/sections/about-preview";
import { Contacts } from "@/components/sections/contacts";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { QuoteBlock } from "@/components/sections/quote-block";
import { Skills } from "@/components/sections/skills";
import { getFeaturedProjects, getProfile, getQuote, getSkills } from "@/lib/content";

export default async function HomePage() {
  const [profile, quote, projects, skills] = await Promise.all([
    getProfile(),
    getQuote(),
    getFeaturedProjects(),
    getSkills(),
  ]);

  return (
    <>
      <Hero profile={profile} />
      <QuoteBlock quote={quote} />
      <FeaturedProjects projects={projects.slice(0, 3)} />
      <Skills groups={skills} />
      <AboutPreview profile={profile} />
      <Contacts profile={profile} />
    </>
  );
}
