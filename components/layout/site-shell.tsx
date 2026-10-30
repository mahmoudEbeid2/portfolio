import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { SideSocialBar } from "./side-social-bar";
import { getProfile } from "@/lib/content";

export async function SiteShell({ children }: { children: ReactNode }) {
  const { name, email, tagline, socials } = await getProfile();
  const sideSocials = socials.filter(({ platform }) => platform !== "phone");

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-background px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:border focus:border-primary"
      >
        Skip to content
      </a>
      <SideSocialBar links={sideSocials} />
      <Header name={name} socials={sideSocials} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer name={name} email={email} tagline={tagline} socials={sideSocials} />
    </>
  );
}
