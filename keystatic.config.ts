import { collection, config, fields, singleton } from "@keystatic/core";

const isProd = process.env.NODE_ENV === "production";

const socialPlatforms = [
  { label: "GitHub", value: "github" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
] as const;

export default config({
  storage: isProd
    ? { kind: "github", repo: { owner: "mahmoudEbeid2", name: "portfolio" } }
    : { kind: "local" },
  ui: {
    brand: { name: "Portfolio" },
    navigation: {
      Content: ["projects"],
      Profile: ["profile", "skills", "experience", "education", "courses", "funFacts", "quote"],
    },
  },
  singletons: {
    profile: singleton({
      label: "Profile",
      path: "content/profile",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Name", validation: { isRequired: true } }),
        fullName: fields.text({ label: "Full name", validation: { isRequired: true } }),
        roles: fields.array(fields.text({ label: "Role" }), {
          label: "Highlighted roles",
          description: "Shown in primary in the hero heading.",
          itemLabel: (props) => props.value,
          validation: { length: { min: 1 } },
        }),
        headline: fields.text({ label: "Headline", multiline: true }),
        tagline: fields.text({ label: "Footer tagline" }),
        bio: fields.array(fields.text({ label: "Paragraph", multiline: true }), {
          label: "Bio paragraphs",
          itemLabel: (props) => props.value.slice(0, 60),
        }),
        contactText: fields.text({ label: "Contact section text", multiline: true }),
        photo: fields.image({
          label: "Hero photo",
          directory: "public/images/profile",
          publicPath: "/images/profile/",
        }),
        aboutPhoto: fields.image({
          label: "About photo",
          directory: "public/images/profile",
          publicPath: "/images/profile/",
        }),
        currentProject: fields.text({ label: "Currently working on" }),
        cvUrl: fields.url({ label: "CV URL" }),
        location: fields.text({ label: "Location" }),
        email: fields.text({ label: "Email", validation: { isRequired: true } }),
        availableForWork: fields.checkbox({ label: "Available for work", defaultValue: true }),
        socials: fields.array(
          fields.object({
            platform: fields.select({
              label: "Platform",
              options: socialPlatforms,
              defaultValue: "github",
            }),
            label: fields.text({ label: "Label" }),
            url: fields.text({ label: "URL", description: "Use mailto: / tel: for email and phone." }),
          }),
          { label: "Social links", itemLabel: (props) => props.fields.label.value },
        ),
      },
    }),
    skills: singleton({
      label: "Skills",
      path: "content/skills",
      format: { data: "json" },
      schema: {
        groups: fields.array(
          fields.object({
            name: fields.text({ label: "Group name" }),
            items: fields.array(fields.text({ label: "Skill" }), {
              label: "Skills",
              itemLabel: (props) => props.value,
            }),
          }),
          { label: "Groups", itemLabel: (props) => props.fields.name.value },
        ),
      },
    }),
    experience: singleton({
      label: "Experience",
      path: "content/experience",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            role: fields.text({ label: "Role" }),
            company: fields.text({ label: "Company" }),
            location: fields.text({ label: "Location" }),
            start: fields.text({ label: "Start", description: "e.g. Mar 2025" }),
            end: fields.text({ label: "End", description: "Leave empty if this is your current role." }),
            achievements: fields.array(fields.text({ label: "Achievement", multiline: true }), {
              label: "Achievements",
              itemLabel: (props) => props.value.slice(0, 60),
            }),
          }),
          {
            label: "Positions",
            itemLabel: (props) => `${props.fields.role.value} — ${props.fields.company.value}`,
          },
        ),
      },
    }),
    education: singleton({
      label: "Education",
      path: "content/education",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            degree: fields.text({ label: "Degree" }),
            school: fields.text({ label: "School" }),
            start: fields.text({ label: "Start" }),
            end: fields.text({ label: "End" }),
          }),
          { label: "Education", itemLabel: (props) => props.fields.degree.value },
        ),
      },
    }),
    courses: singleton({
      label: "Courses",
      path: "content/courses",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: "Course" }),
            instructor: fields.text({ label: "Instructor" }),
            platform: fields.text({ label: "Platform" }),
            year: fields.text({ label: "Year" }),
            status: fields.select({
              label: "Status",
              options: [
                { label: "Completed", value: "completed" },
                { label: "In progress", value: "in-progress" },
              ],
              defaultValue: "completed",
            }),
          }),
          { label: "Courses", itemLabel: (props) => props.fields.name.value },
        ),
      },
    }),
    funFacts: singleton({
      label: "Fun facts",
      path: "content/fun-facts",
      format: { data: "json" },
      schema: {
        items: fields.array(fields.text({ label: "Fact" }), {
          label: "Facts",
          itemLabel: (props) => props.value,
        }),
      },
    }),
    quote: singleton({
      label: "Quote",
      path: "content/quote",
      format: { data: "json" },
      schema: {
        text: fields.text({ label: "Text", multiline: true }),
        author: fields.text({ label: "Author" }),
      },
    }),
  },
  collections: {
    projects: collection({
      label: "Projects",
      path: "content/projects/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "category", "order", "status"],
      schema: {
        title: fields.slug({ name: { label: "Title", validation: { isRequired: true } } }),
        summary: fields.text({ label: "Summary", multiline: true, validation: { isRequired: true } }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Complete app", value: "complete-app" },
            { label: "Small project", value: "small-project" },
          ],
          defaultValue: "complete-app",
        }),
        featured: fields.checkbox({ label: "Featured on home page", defaultValue: false }),
        order: fields.integer({ label: "Order", defaultValue: 100 }),
        cover: fields.image({
          label: "Cover image",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Image",
              directory: "public/images/projects",
              publicPath: "/images/projects/",
              validation: { isRequired: true },
            }),
            alt: fields.text({ label: "Alt text" }),
          }),
          { label: "Gallery", itemLabel: (props) => props.fields.alt.value || "Image" },
        ),
        stack: fields.array(fields.text({ label: "Technology" }), {
          label: "Stack",
          itemLabel: (props) => props.value,
        }),
        role: fields.text({ label: "My role" }),
        isTeamProject: fields.checkbox({ label: "Team project", defaultValue: false }),
        timeline: fields.text({ label: "Timeline", description: "e.g. Jan 2025 – Apr 2025" }),
        links: fields.object(
          {
            demo: fields.url({ label: "Live demo" }),
            github: fields.url({ label: "GitHub" }),
            other: fields.array(
              fields.object({
                label: fields.text({ label: "Label" }),
                url: fields.url({ label: "URL", validation: { isRequired: true } }),
              }),
              { label: "Other links", itemLabel: (props) => props.fields.label.value },
            ),
          },
          { label: "Links" },
        ),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" },
          ],
          defaultValue: "published",
        }),
        body: fields.mdx({ label: "Body" }),
      },
    }),
  },
});
