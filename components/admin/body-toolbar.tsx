"use client";

import Image from "next/image";
import { useState } from "react";
import {
  buttonSnippet,
  figureSnippet,
  gallerySnippet,
  imageGridSnippet,
  youTubeSnippet,
  type SnippetImage,
} from "@/lib/mdx-snippets";
import { parseYouTubeId } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "./fields";
import { UploadButton } from "./upload-field";

const tools = [
  { key: "figure", label: "Figure" },
  { key: "grid", label: "Image grid" },
  { key: "gallery", label: "Gallery" },
  { key: "button", label: "Button" },
  { key: "youtube", label: "YouTube" },
] as const;

type ToolKey = (typeof tools)[number]["key"];

type PanelProps = {
  onInsert: (snippet: string) => void;
  onCancel: () => void;
};

function PanelActions({
  canInsert,
  onInsert,
  onCancel,
}: {
  canInsert: boolean;
  onInsert: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button disabled={!canInsert} onClick={onInsert}>
        Insert
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}

type ImagePickerProps = {
  images: SnippetImage[];
  multiple: boolean;
  onChange: (update: (current: SnippetImage[]) => SnippetImage[]) => void;
};

function ImagePicker({ images, multiple, onChange }: ImagePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      {images.map((image, index) => (
        <div key={image.src} className="flex flex-wrap items-start gap-3">
          <span className="relative block aspect-video w-32 shrink-0 border border-line">
            <Image src={image.src} alt="" fill sizes="128px" className="object-cover" />
          </span>
          <div className="min-w-48 flex-1">
            <TextField
              id={`toolbar-alt-${index}`}
              label="Alt text (required)"
              value={image.alt}
              onChange={(alt) =>
                onChange((current) =>
                  current.map((item, i) => (i === index ? { ...item, alt } : item)),
                )
              }
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => onChange((current) => current.filter((_, i) => i !== index))}
          >
            Remove
          </Button>
        </div>
      ))}
      {(multiple || images.length === 0) && (
        <div>
          <UploadButton
            id="toolbar-upload"
            kind="project"
            label={multiple ? "Upload images" : "Upload image"}
            multiple={multiple}
            onUploaded={(src) => onChange((current) => [...current, { src, alt: "" }])}
          />
        </div>
      )}
    </div>
  );
}

function hasAltText(images: SnippetImage[], minimum: number): boolean {
  return images.length >= minimum && images.every(({ alt }) => alt.trim() !== "");
}

function FigurePanel({ onInsert, onCancel }: PanelProps) {
  const [images, setImages] = useState<SnippetImage[]>([]);
  const [caption, setCaption] = useState("");
  const [size, setSize] = useState("normal");
  const image = images[0];

  return (
    <>
      <ImagePicker images={images} multiple={false} onChange={setImages} />
      <div className="grid gap-2 sm:grid-cols-2">
        <TextField id="toolbar-caption" label="Caption" value={caption} onChange={setCaption} />
        <SelectField
          id="toolbar-size"
          label="Size"
          value={size}
          options={["small", "normal", "wide"]}
          onChange={setSize}
        />
      </div>
      <PanelActions
        canInsert={hasAltText(images, 1)}
        onInsert={() => image && onInsert(figureSnippet(image, caption, size))}
        onCancel={onCancel}
      />
    </>
  );
}

function GridPanel({ onInsert, onCancel }: PanelProps) {
  const [images, setImages] = useState<SnippetImage[]>([]);
  const [cols, setCols] = useState("2");

  return (
    <>
      <ImagePicker images={images} multiple onChange={setImages} />
      <div className="max-w-40">
        <SelectField
          id="toolbar-cols"
          label="Columns"
          value={cols}
          options={["2", "3"]}
          onChange={setCols}
        />
      </div>
      <PanelActions
        canInsert={hasAltText(images, 2)}
        onInsert={() => onInsert(imageGridSnippet(images, Number(cols)))}
        onCancel={onCancel}
      />
    </>
  );
}

function GalleryPanel({ onInsert, onCancel }: PanelProps) {
  const [images, setImages] = useState<SnippetImage[]>([]);

  return (
    <>
      <ImagePicker images={images} multiple onChange={setImages} />
      <PanelActions
        canInsert={hasAltText(images, 2)}
        onInsert={() => onInsert(gallerySnippet(images))}
        onCancel={onCancel}
      />
    </>
  );
}

function ButtonPanel({ onInsert, onCancel }: PanelProps) {
  const [href, setHref] = useState("");
  const [label, setLabel] = useState("");
  const [variant, setVariant] = useState("primary");

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3">
        <TextField id="toolbar-href" label="URL" value={href} onChange={setHref} />
        <TextField id="toolbar-label" label="Label" value={label} onChange={setLabel} />
        <SelectField
          id="toolbar-variant"
          label="Style"
          value={variant}
          options={["primary", "secondary"]}
          onChange={setVariant}
        />
      </div>
      <PanelActions
        canInsert={href.trim() !== "" && label.trim() !== ""}
        onInsert={() => onInsert(buttonSnippet(href.trim(), label.trim(), variant))}
        onCancel={onCancel}
      />
    </>
  );
}

function YouTubePanel({ onInsert, onCancel }: PanelProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const id = parseYouTubeId(url);

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        <TextField
          id="toolbar-youtube"
          label="YouTube URL"
          value={url}
          error={url.trim() && !id ? "That isn't a YouTube video URL." : undefined}
          onChange={setUrl}
        />
        <TextField id="toolbar-video-title" label="Title" value={title} onChange={setTitle} />
      </div>
      <PanelActions
        canInsert={Boolean(id) && title.trim() !== ""}
        onInsert={() => id && onInsert(youTubeSnippet(id, title.trim()))}
        onCancel={onCancel}
      />
    </>
  );
}

const panels = {
  figure: FigurePanel,
  grid: GridPanel,
  gallery: GalleryPanel,
  button: ButtonPanel,
  youtube: YouTubePanel,
};

/** Inserts media components into the body at the cursor. */
export function BodyToolbar({ onInsert }: { onInsert: (snippet: string) => void }) {
  const [active, setActive] = useState<ToolKey | null>(null);
  const Panel = active && panels[active];

  return (
    <div className="flex flex-col gap-2">
      <div role="toolbar" aria-label="Insert into body" className="flex flex-wrap gap-2">
        {tools.map(({ key, label }) => (
          <Button
            key={key}
            variant={active === key ? "primary" : "secondary"}
            aria-expanded={active === key}
            onClick={() => setActive(active === key ? null : key)}
          >
            {label}
          </Button>
        ))}
      </div>
      {Panel && (
        <div
          className="flex flex-col gap-3 border border-primary p-4"
          onKeyDown={(event) => {
            // Enter here must not submit the whole project.
            if (event.key === "Enter") event.preventDefault();
          }}
        >
          <Panel
            key={active}
            onCancel={() => setActive(null)}
            onInsert={(snippet) => {
              onInsert(snippet);
              setActive(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
