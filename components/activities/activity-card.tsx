import Image from "next/image";
import { MdxContent } from "@/components/projects/mdx-content";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { activityImages, formatActivityDates } from "@/lib/activities";
import type { ActivityItem } from "@/lib/content";
import { ActivityGallery } from "./activity-gallery";

type ActivityCardProps = {
  activity: ActivityItem;
  /** Adds the description and every link, for the full activities page. */
  detailed?: boolean;
};

export function ActivityCard({ activity, detailed = false }: ActivityCardProps) {
  const { type, title, organization, role, result, location, description, coverImage, links } =
    activity;
  const images = activityImages(activity);
  const isCertificate = type === "certificate";
  const verifyLink = isCertificate ? links[0] : undefined;
  const otherLinks = !detailed ? [] : isCertificate ? links.slice(1) : links;
  const outcome = [result, role].filter(Boolean).join(" · ");
  const when = [formatActivityDates(activity), location].filter(Boolean).join(" · ");

  return (
    <Card as="article" className="project-card relative h-full">
      {coverImage && (
        <div className="relative aspect-[330/201] border-b border-line">
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Tag className="w-fit text-sm">{type}</Tag>
        {images.length > 0 ? (
          <ActivityGallery title={title} images={images} />
        ) : (
          <h3 className="text-2xl font-medium">{title}</h3>
        )}
        {outcome && <p className="text-white">{outcome}</p>}
        <p>
          {isCertificate ? "Issued by " : <span className="text-primary">@</span>}
          {organization}
        </p>
        <p className="flex-1 text-sm">{when}</p>
        {detailed && description && (
          <div className="relative z-10 flex flex-col gap-3">
            <MdxContent source={description} />
          </div>
        )}
        {(verifyLink || otherLinks.length > 0) && (
          <div className="flex flex-wrap gap-4">
            {verifyLink && (
              <ButtonLink href={verifyLink.url} className="relative z-10">
                Verify<span className="sr-only"> {title}</span>
                <span aria-hidden="true">↗</span>
              </ButtonLink>
            )}
            {otherLinks.map(({ label, url }) => (
              <ButtonLink key={url} href={url} variant="secondary" className="relative z-10">
                {label}
                <span aria-hidden="true">↗</span>
              </ButtonLink>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
