import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/projects/mdx-content";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectLinks } from "@/components/projects/project-links";
import { ProjectMeta } from "@/components/projects/project-meta";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { getNextProject, getProject, getProjects } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { type: "article", url: `/projects/${slug}`, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, next] = await Promise.all([getProject(slug), getNextProject(slug)]);
  if (!project) notFound();

  return (
    <article className="pt-12">
      <Container className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <Link href="/projects" className="w-fit transition-colors hover:text-white">
            &lt;- all projects
          </Link>
          <SectionTitle as="h1" name={project.slug} />
          <p className="text-xl text-white">{project.title}</p>
          <p className="max-w-3xl">{project.summary}</p>
        </header>

        <ProjectMeta project={project} />

        {project.cover && (
          <div className="relative aspect-video border border-gray">
            <Image
              src={project.cover}
              alt={`${project.title} cover`}
              fill
              priority
              sizes="(min-width: 1024px) 976px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl">
          <MdxContent source={project.body} />
        </div>

        <ProjectGallery images={project.gallery} title={project.title} />
        <ProjectLinks links={project.links} />

        {next && (
          <nav aria-label="Next project" className="flex justify-end border-t border-gray pt-8">
            <Link href={`/projects/${next.slug}`} className="group flex flex-col items-end gap-1">
              <span>next project</span>
              <span className="text-2xl font-medium text-white transition-colors group-hover:text-primary">
                {next.title} ~~&gt;
              </span>
            </Link>
          </nav>
        )}
      </Container>
    </article>
  );
}
