import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const SITE_NAME = "Mahmoud Ebeid";

/**
 * Next.js replaces (rather than merges) a parent's `openGraph` object, so
 * every page builds its Open Graph data from these shared defaults.
 */
export function openGraph(url: string, overrides: Partial<OpenGraph> = {}): OpenGraph {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url,
    ...overrides,
  } as OpenGraph;
}
