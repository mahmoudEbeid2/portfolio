"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Toast = { id: number; message: string; tone: "success" | "error" };
type ShowToast = (message: string, tone?: Toast["tone"]) => void;

const ToastContext = createContext<ShowToast>(() => undefined);

const DURATION_MS = 4000;

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const show = useCallback<ShowToast>((message, tone = "success") => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed right-4 bottom-4 z-50 flex max-w-xs flex-col gap-2"
      >
        {toasts.map(({ id, message, tone }) => (
          <p
            key={id}
            className={cn(
              "border bg-background px-4 py-2 text-white",
              tone === "success" ? "border-gray" : "border-primary",
            )}
          >
            {message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
