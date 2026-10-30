import { socialIcons } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { SocialLink } from "@/lib/site";

type SocialLinksProps = {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
};

export function SocialLinks({ links, className, iconClassName = "size-8" }: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map(({ platform, label, url }) => {
        const Icon = socialIcons[platform];
        const external = url.startsWith("http");
        return (
          <li key={url}>
            <a
              href={url}
              aria-label={label}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="flex size-11 items-center justify-center text-gray transition-colors hover:text-white"
            >
              <Icon className={iconClassName} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
