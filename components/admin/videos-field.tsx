"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectData } from "@/lib/schemas";
import { parseYouTubeId, youTubeThumbnail } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { YouTubeFacade } from "@/components/ui/youtube-facade";
import { ConfirmButton } from "./confirm-button";
import { TextField } from "./fields";
import { SortableList } from "./sortable-list";

type Video = ProjectData["videos"][number];

type VideosFieldProps = {
  videos: Video[];
  error?: string;
  onChange: (videos: Video[]) => void;
  /** Reports unsaved input, so a pasted video isn't lost when the form is saved. */
  onDraftChange: (hasDraft: boolean) => void;
};

const BAD_URL = "That isn't a YouTube video URL.";

function withOrder(videos: Video[]): Video[] {
  return videos.map((video, order) => ({ ...video, order }));
}

function Thumbnail({ id, title }: { id: string; title: string }) {
  return (
    <span className="relative block aspect-video w-32 shrink-0 border border-line">
      <Image src={youTubeThumbnail(id)} alt={title} fill sizes="128px" className="object-cover" />
    </span>
  );
}

export function VideosField({ videos, error, onChange, onDraftChange }: VideosFieldProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string>();

  const youtubeId = parseYouTubeId(url);
  const isDuplicate = videos.some((video) => video.youtubeId === youtubeId);
  const urlError = !url.trim()
    ? undefined
    : !youtubeId
      ? BAD_URL
      : isDuplicate
        ? "This video is already on the project."
        : undefined;

  function setDraft(nextUrl: string, nextTitle: string) {
    setUrl(nextUrl);
    setTitle(nextTitle);
    setTitleError(undefined);
    onDraftChange(Boolean(nextUrl.trim() || nextTitle.trim()));
  }

  function add() {
    if (!youtubeId || urlError) return;
    if (!title.trim()) {
      setTitleError("Add a title for this video.");
      return;
    }
    onChange(withOrder([...videos, { youtubeId, title: title.trim(), order: videos.length }]));
    setDraft("", "");
  }

  return (
    <fieldset className="flex flex-col gap-3 border border-line p-4">
      <legend className="px-1 text-white">Videos</legend>

      {videos.length > 0 && (
        <SortableList
          items={videos.map((video) => ({ ...video, id: video.youtubeId }))}
          label="video"
          onReorder={(next) =>
            onChange(
              withOrder(next.map(({ youtubeId, title, order }) => ({ youtubeId, title, order }))),
            )
          }
        >
          {(video) => (
            <div className="flex flex-wrap items-center gap-3">
              <Thumbnail id={video.youtubeId} title={video.title} />
              <p className="min-w-0 flex-1 break-words text-white">{video.title}</p>
              <ConfirmButton
                title="Remove this video?"
                description={`"${video.title}" leaves the project when you save.`}
                confirmLabel="Remove"
                onConfirm={() =>
                  onChange(withOrder(videos.filter(({ youtubeId: id }) => id !== video.youtubeId)))
                }
              >
                Remove
              </ConfirmButton>
            </div>
          )}
        </SortableList>
      )}

      {error && <p className="text-sm text-primary">{error}</p>}

      <div
        className="grid items-start gap-2 sm:grid-cols-2"
        onKeyDown={(event) => {
          // Enter adds the video here instead of submitting the whole project.
          if (event.key !== "Enter") return;
          event.preventDefault();
          add();
        }}
      >
        <TextField
          id="video-url"
          label="YouTube URL"
          value={url}
          error={urlError}
          onChange={(value) => setDraft(value, title)}
        />
        <TextField
          id="video-title"
          label="Video title"
          value={title}
          error={titleError}
          onChange={(value) => setDraft(url, value)}
        />
      </div>

      {youtubeId && !urlError && (
        <div className="w-full max-w-sm border border-line">
          <YouTubeFacade id={youtubeId} title={title || "pasted video"} sizes="384px" />
        </div>
      )}

      <Button
        variant="secondary"
        className="w-fit"
        disabled={!youtubeId || Boolean(urlError)}
        onClick={add}
      >
        Add video
      </Button>
    </fieldset>
  );
}
