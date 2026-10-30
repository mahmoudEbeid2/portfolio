import { socialIcons } from "@/components/ui/icons";
import type { SocialLink } from "@/lib/content";

type ContactBoxProps = {
  links: readonly SocialLink[];
};

/** Bordered "Message me here" box with direct contact links. */
export function ContactBox({ links }: ContactBoxProps) {
  return (
    <div className="flex w-full flex-col gap-4 border border-gray p-4 sm:w-fit">
      <h3 className="font-semibold">Message me here</h3>
      <ul className="flex flex-col gap-2">
        {links.map(({ platform, label, url }) => {
          const Icon = socialIcons[platform];
          const text = url.replace(/^(mailto:|tel:)/, "").replace(/^https?:\/\/(www\.)?/, "");
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
                  {text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
