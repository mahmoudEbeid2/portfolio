"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import type { NavItem, SocialLink } from "@/lib/site";
import { NavLinks } from "./nav-links";
import { SocialLinks } from "./social-links";
import { ThemeToggle } from "./theme-toggle";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileMenuProps = {
  name: string;
  items: NavItem[];
  socials: readonly SocialLink[];
};

export function MobileMenu({ name, items, socials }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen(true)}
        className="flex size-11 items-center justify-center text-gray transition-colors hover:text-white"
      >
        <MenuIcon className="size-6" />
      </button>

      {open && (
        <div
          ref={dialogRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-4 pt-6 pb-10"
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label={`${name} — home`}
              className="inline-flex min-h-11 items-center"
            >
              <Logo name={name} />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="flex size-11 items-center justify-center text-gray transition-colors hover:text-white"
              >
                <CloseIcon className="size-6" />
              </button>
            </div>
          </div>

          <nav aria-label="Mobile" className="mt-12">
            <NavLinks
              items={items}
              onNavigate={() => setOpen(false)}
              className="flex flex-col gap-6"
              linkClassName="text-[32px]"
            />
          </nav>

          <SocialLinks links={socials} className="mt-auto justify-center pt-12" />
        </div>
      )}
    </div>
  );
}
