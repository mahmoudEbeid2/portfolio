import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { AdminNav } from "./admin-nav";
import { ToastProvider } from "./toast";

type AdminShellProps = { unread: number; children: ReactNode };

export function AdminShell({ unread, children }: AdminShellProps) {
  return (
    <ToastProvider>
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="flex shrink-0 flex-col gap-6 border-b border-line p-4 md:sticky md:top-0 md:h-dvh md:w-64 md:border-r md:border-b-0">
          <div className="flex items-center justify-between">
            <Link href="/admin" aria-label="Dashboard home" className="min-h-11 content-center">
              <Logo />
            </Link>
            <ThemeToggle />
          </div>
          <AdminNav unread={unread} />
          <div className="flex items-center gap-4 md:mt-auto">
            <Link href="/" className="transition-colors hover:text-white">
              View site
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <Button type="submit" variant="secondary">
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
