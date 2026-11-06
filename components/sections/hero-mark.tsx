import octicons from "@primer/octicons";
import { githubProfileUrl } from "@/lib/site";

const mark = octicons["mark-github"].heights[24];

/** The GitHub mark in the hero photo slot, linked to the profile. */
export function HeroMark() {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center">
      <a
        href={githubProfileUrl}
        aria-label="GitHub profile"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-mark relative block w-[min(280px,78%)] text-gray transition-colors duration-300 hover:text-primary focus-visible:text-primary"
      >
        <span aria-hidden="true" className="hero-mark-glow absolute -inset-6" />
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          className="relative block aspect-square w-full"
          dangerouslySetInnerHTML={{ __html: mark?.path ?? "" }}
        />
      </a>
    </div>
  );
}
