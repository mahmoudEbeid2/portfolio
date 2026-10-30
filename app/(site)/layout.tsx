import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SideSocialBar } from "@/components/layout/side-social-bar";
import { getProfile } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
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
