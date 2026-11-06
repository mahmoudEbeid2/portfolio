/** Cache tags for content reads. Dashboard saves invalidate the matching tag. */
export const contentTags = {
  profile: "content:profile",
  skills: "content:skills",
  experience: "content:experience",
  education: "content:education",
  courses: "content:courses",
  funFacts: "content:fun-facts",
  quote: "content:quote",
  projects: "content:projects",
  activities: "content:activities",
} as const;
