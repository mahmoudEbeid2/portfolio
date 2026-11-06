import type { Profile } from "@/lib/content";
import { absoluteUrl, siteUrl } from "@/lib/site-url";
import { JsonLd } from "./json-ld";

/** Schema.org `Person` structured data for the home page. */
export function PersonJsonLd({ profile }: { profile: Profile }) {
  const sameAs = profile.socials.map(({ url }) => url).filter((url) => url.startsWith("http"));

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    jobTitle: profile.tagline,
    description: profile.headline,
    ...(profile.location && {
      address: { "@type": "PostalAddress", addressLocality: profile.location },
    }),
    ...(profile.photo && { image: absoluteUrl(profile.photo) }),
    sameAs,
  };

  return <JsonLd data={data} />;
}
