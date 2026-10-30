"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isActivePath, type NavItem } from "@/lib/site";

type NavLinksProps = {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({ items, className, linkClassName, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {items.map(({ label, href }) => {
        const active = isActivePath(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center transition-colors hover:text-white",
                active ? "font-medium text-white" : "text-gray",
                linkClassName,
              )}
            >
              <span className="text-primary">#</span>
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
