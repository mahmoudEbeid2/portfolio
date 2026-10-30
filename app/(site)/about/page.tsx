import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/about-intro";
import { EducationCourses } from "@/components/about/education-courses";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { FunFacts } from "@/components/about/fun-facts";
import { Skills } from "@/components/sections/skills";
import { Container } from "@/components/ui/container";
import { PageTitle } from "@/components/ui/page-title";
import {
  getCourses,
  getEducation,
  getExperience,
  getFunFacts,
  getProfile,
  getSkills,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "About me",
  description: "Background, skills, experience and education of Mahmoud Ebeid.",
};

export default async function AboutPage() {
  const [profile, skills, experience, education, courses, funFacts] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperience(),
    getEducation(),
    getCourses(),
    getFunFacts(),
  ]);

  return (
    <>
      <Container className="pt-12">
        <PageTitle name="about-me" subtitle="Who am i?" />
      </Container>
      <AboutIntro profile={profile} />
      <Skills groups={skills} />
      <ExperienceTimeline items={experience} />
      <EducationCourses education={education} courses={courses} />
      <FunFacts facts={funFacts} />
    </>
  );
}
