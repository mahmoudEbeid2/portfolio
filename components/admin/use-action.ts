"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { ActionResult } from "@/lib/admin/types";
import { useToast } from "./toast";

const SESSION_ERROR = "Your session has expired. Please sign in again.";

/** Runs a server action inside a transition and reports the outcome as a toast. */
export function useAction() {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const run = useCallback(
    (action: () => Promise<ActionResult>, onDone?: (result: ActionResult) => void) => {
      startTransition(async () => {
        try {
          const result = await action();
          if (result.ok) {
            if (result.message) toast(result.message);
          } else {
            toast(result.message, "error");
          }
          onDone?.(result);
        } catch {
          // requireAdmin throws when the session is gone.
          toast(SESSION_ERROR, "error");
          router.push("/admin/login");
        }
      });
    },
    [router, toast],
  );

  return { pending, run };
}
