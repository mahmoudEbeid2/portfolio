import type { ProjectWithBody } from "@/lib/content";
import { youTubeThumbnail, youTubeWatchUrl } from "@/lib/youtube";
import { JsonLd } from "./json-ld";

/** Schema.org `VideoObject` structured data for a project's videos. */
export function VideoJsonLd({ project }: { project: ProjectWithBody }) {
  if (project.videos.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@graph": project.videos.map(({ youtubeId, title }) => ({
      "@type": "VideoObject",
      name: title,
      description: project.summary,
      thumbnailUrl: youTubeThumbnail(youtubeId),
      url: youTubeWatchUrl(youtubeId),
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    })),
  };

  return <JsonLd data={data} />;
}
