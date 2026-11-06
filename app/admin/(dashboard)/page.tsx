import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default function OverviewPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-medium">Overview</h1>
      <form
        className="mt-4"
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/admin/login" });
        }}
      >
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </main>
  );
}
