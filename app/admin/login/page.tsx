import type { Metadata } from "next";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Sign in" };

const errorMessages: Record<string, string> = {
  AccessDenied: "This GitHub account isn't allowed to access the dashboard.",
  Configuration: "Sign-in isn't configured correctly. Check the auth environment variables.",
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  const message =
    typeof error === "string" ? (errorMessages[error] ?? "Sign-in failed. Try again.") : null;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6 border border-line p-6">
        <Logo />
        <div>
          <h1 className="text-2xl font-medium">
            <span className="text-primary">#</span>admin
          </h1>
          <p className="mt-2">Sign in to manage the site content.</p>
        </div>
        {message && (
          <p role="alert" className="border border-primary p-2 text-primary">
            {message}
          </p>
        )}
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <Button type="submit" className="w-full">
            <GitHubIcon className="size-5" />
            Continue with GitHub
          </Button>
        </form>
      </div>
    </main>
  );
}
