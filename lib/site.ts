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

export const githubUsername = "mahmoudEbeid2";
export const githubProfileUrl = `https://github.com/${githubUsername}`;
export const heroImageUrl = "https://avatars.githubusercontent.com/u/9919?v=4";

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
