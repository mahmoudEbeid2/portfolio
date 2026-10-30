import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const SITE_NAME = "Mahmoud Ebeid";

/**
 * Next.js replaces (rather than merges) a parent's `openGraph` object, so
 * every page builds its Open Graph data from these shared defaults. Pages with
 * their own colocated opengraph-image route pass `defaultImage: false`.
 */
export function openGraph(
  url: string,
  overrides: Partial<OpenGraph> = {},
  { defaultImage = true }: { defaultImage?: boolean } = {},
): OpenGraph {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url,
    ...(defaultImage && {
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
    }),
    ...overrides,
  } as OpenGraph;
}
