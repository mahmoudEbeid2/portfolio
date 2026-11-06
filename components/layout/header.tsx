import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { navItems, type SocialLink } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = {
  name: string;
  socials: readonly SocialLink[];
};

function LanguageSwitcher() {
  // UI only for now — the site is English-only.
  return (
    <span className="font-semibold text-gray" title="Language: English">
      EN
    </span>
  );
}

export function Header({ name, socials }: HeaderProps) {
  return (
    <header className="pt-6 pb-4 sm:pt-8">
      <Container className="flex items-center justify-between gap-6">
        <Link href="/" aria-label={`${name} — home`} className="inline-flex min-h-11 items-center">
          <Logo name={name} />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-5 md:flex lg:gap-8">
          <NavLinks items={navItems} className="flex items-center gap-5 lg:gap-8" />
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
        <MobileMenu name={name} items={navItems} socials={socials} />
      </Container>
    </header>
  );
}
