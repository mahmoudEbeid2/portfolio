import type { SocialPlatform } from "@/components/ui/icons";

export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
};

export const navItems: NavItem[] = [
  { label: "home", href: "/" },
  { label: "works", href: "/projects" },
  { label: "about-me", href: "/about" },
  { label: "contacts", href: "/contacts" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Temporary until the profile content is managed in Keystatic.
export const socials: SocialLink[] = [
  { platform: "github", label: "GitHub", url: "https://github.com/mahmoudEbeid2" },
  { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/mahmoud-ebead" },
  { platform: "email", label: "Email", url: "mailto:mahmoud.ebeid2002@gmail.com" },
];
