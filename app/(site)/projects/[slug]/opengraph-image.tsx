import { getProject, getProjects } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Project by Mahmoud Ebeid";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  return renderOgImage({
    eyebrow: "#projects",
    title: project?.title ?? "Project",
    description: project?.summary,
    tags: project?.stack,
  });
}
