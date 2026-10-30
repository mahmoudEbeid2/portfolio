import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import type { SocialLink } from "@/lib/site";
import { SocialLinks } from "./social-links";

type FooterProps = {
  name: string;
  email: string;
  tagline: string;
  socials: readonly SocialLink[];
};

export function Footer({ name, email, tagline, socials }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-gray pt-8 pb-8">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/" aria-label={`${name} — home`}>
                <Logo name={name} />
              </Link>
              <a href={`mailto:${email}`} className="transition-colors hover:text-white">
                {email}
              </a>
            </div>
            <p className="text-white">{tagline}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-medium">Media</h2>
            <SocialLinks links={socials} className="-ml-2.5" />
          </div>
        </div>
        <p className="text-center">
          © Copyright {year}. Made by {name}
        </p>
      </Container>
    </footer>
  );
}
