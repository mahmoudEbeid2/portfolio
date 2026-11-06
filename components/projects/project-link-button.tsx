import { ButtonLink } from "@/components/ui/button";
import { projectLinkIcons } from "@/lib/project-link-icons";
import type { ProjectLink } from "@/lib/project-links";

type ProjectLinkButtonProps = {
  link: ProjectLink;
  /** Extra text for screen readers, for pages that list many projects. */
  context?: string;
};

export function ProjectLinkButton({ link, context }: ProjectLinkButtonProps) {
  const { label, url, type, variant } = link;

  return (
    <ButtonLink href={url} variant={variant}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className="size-4 shrink-0"
        dangerouslySetInnerHTML={{ __html: projectLinkIcons[type] }}
      />
      {label}
      {context && <span className="sr-only"> {context}</span>}
    </ButtonLink>
  );
}
