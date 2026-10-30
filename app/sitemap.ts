import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const pages = ["", "/projects", "/about", "/contacts"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...pages,
    ...projects.map(({ slug }) => ({
      url: `${siteUrl}/projects/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
