import { SectionTitle } from "@/components/ui/section-title";
import { YouTubeFacade } from "@/components/ui/youtube-facade";
import type { ProjectVideo } from "@/lib/content";

export function ProjectVideos({ videos }: { videos: readonly ProjectVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <section aria-labelledby="demo" className="flex flex-col gap-6">
      <SectionTitle id="demo" name="demo" />
      <ul className="grid gap-4 sm:grid-cols-2">
        {videos.map(({ youtubeId, title }) => (
          <li key={youtubeId}>
            <figure className="flex h-full flex-col border border-line">
              <YouTubeFacade id={youtubeId} title={title} />
              <figcaption className="flex-1 border-t border-line p-2">{title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
