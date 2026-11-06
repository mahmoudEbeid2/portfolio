"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { label: "Overview", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Education & Courses", href: "/admin/education" },
  { label: "Fun facts", href: "/admin/fun-facts" },
  { label: "Messages", href: "/admin/messages" },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard">
      <ul className="flex flex-wrap gap-x-4 md:flex-col">
        {links.map(({ label, href }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white",
                  active ? "font-medium text-white" : "text-gray",
                )}
              >
                <span aria-hidden="true" className="text-primary">
                  #
                </span>
                {label}
                {href === "/admin/messages" && unread > 0 && (
                  <span className="border border-primary px-1 text-sm text-white">
                    {unread}
                    <span className="sr-only"> unread</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
