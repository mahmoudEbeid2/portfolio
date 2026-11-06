"use client";

import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  title: string;
  description?: string;
  confirmLabel?: string;
  disabled?: boolean;
  onConfirm: () => void;
  children: ReactNode;
};

/** A button that asks for confirmation in a modal before running `onConfirm`. */
export function ConfirmButton({
  title,
  description,
  confirmLabel = "Delete",
  disabled,
  onConfirm,
  children,
}: ConfirmButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        variant="secondary"
        disabled={disabled}
        onClick={() => dialogRef.current?.showModal()}
      >
        {children}
      </Button>
      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-sm border border-line bg-background p-6 text-gray backdrop:bg-black/60"
      >
        <h2 className="text-xl font-medium">{title}</h2>
        {description && <p className="mt-2">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => dialogRef.current?.close()}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              dialogRef.current?.close();
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  );
}
