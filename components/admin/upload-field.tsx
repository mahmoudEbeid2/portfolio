"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { canDeliver, signUpload } from "@/lib/admin/actions/uploads";
import { uploadKinds, type UploadKind } from "@/lib/upload-kinds";
import { Button } from "@/components/ui/button";
import { FieldShell } from "./fields";
import { useToast } from "./toast";

type UploadButtonProps = {
  id: string;
  kind: UploadKind;
  label: string;
  onUploaded: (url: string) => void;
};

const PDF_BLOCKED =
  "Cloudinary is blocking PDF downloads. Turn on PDF and ZIP delivery in Cloudinary under Settings > Security, then upload again.";

async function sendToCloudinary(kind: UploadKind, file: File): Promise<string> {
  const signed = await signUpload(kind);
  if ("error" in signed) throw new Error(signed.error);

  const body = new FormData();
  body.append("file", file);
  Object.entries(signed.fields).forEach(([name, value]) => body.append(name, value));

  const response = await fetch(signed.url, { method: "POST", body });
  const result = (await response.json()) as {
    secure_url?: string;
    error?: { message: string };
  };
  if (!result.secure_url) throw new Error(result.error?.message ?? "The upload failed.");

  // A blocked PDF still uploads fine, then fails for every visitor who opens it.
  if (kind === "cv" && !(await canDeliver(result.secure_url))) throw new Error(PDF_BLOCKED);
  return result.secure_url;
}

/** Picks a file and uploads it. The URL only sticks once the form is saved. */
export function UploadButton({ id, kind, label, onUploaded }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { accept, maxBytes } = uploadKinds[kind];

  async function upload(file: File) {
    if (file.size > maxBytes) {
      toast(`That file is too large. The limit is ${maxBytes / (1024 * 1024)}MB.`, "error");
      return;
    }

    setUploading(true);
    try {
      onUploaded(await sendToCloudinary(kind, file));
      toast("Uploaded. Save the form to keep it.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The upload failed.";
      toast(message, "error");
      if (message === "Unauthorized") router.push("/admin/login");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
      <Button variant="secondary" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? "Uploading..." : label}
      </Button>
    </>
  );
}

type ImageFieldProps = {
  id: string;
  label: string;
  kind: UploadKind;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function ImageField({ id, label, kind, value, error, onChange }: ImageFieldProps) {
  return (
    <FieldShell id={`${id}-upload`} label={label} error={error}>
      {value && (
        <span className="relative block aspect-video w-full max-w-64 border border-line">
          <Image src={value} alt={`${label} preview`} fill sizes="256px" className="object-cover" />
        </span>
      )}
      <div className="mt-1 flex flex-wrap gap-2">
        <UploadButton
          id={`${id}-upload`}
          kind={kind}
          label={value ? "Replace" : "Upload image"}
          onUploaded={onChange}
        />
        {value && (
          <Button variant="secondary" onClick={() => onChange("")}>
            Remove
          </Button>
        )}
      </div>
    </FieldShell>
  );
}
