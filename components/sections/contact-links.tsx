import { socialIcons } from "@/components/ui/icons";
import type { SocialLink } from "@/lib/content";
import { cn } from "@/lib/cn";

function displayText(url: string): string {
  return url.replace(/^(mailto:|tel:)/, "").replace(/^https?:\/\/(www\.)?/, "");
}

type ContactLinksProps = {
  links: readonly SocialLink[];
  className?: string;
};

/** Social / contact links rendered as icon + readable address. */
export function ContactLinks({ links, className }: ContactLinksProps) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {links.map(({ platform, label, url }) => {
        const Icon = socialIcons[platform];
        return (
          <li key={url}>
            <a
              href={url}
              {...(url.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex min-h-11 items-center gap-2 break-all transition-colors hover:text-white"
            >
              <Icon className="size-8 shrink-0" />
              <span>
                <span className="sr-only">{label}: </span>
                {displayText(url)}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
