"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "@/components/ui/icons";
import { isYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from "@/lib/youtube";

type YouTubeFacadeProps = {
  id: string;
  title: string;
  sizes?: string;
};

const IFRAME_PERMISSIONS =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

/** A thumbnail that loads the real player, and its scripts, only when clicked. */
export function YouTubeFacade({
  id,
  title,
  sizes = "(min-width: 640px) 480px, 100vw",
}: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // The button disappears on click, so focus moves to the player that replaced it.
  useEffect(() => {
    if (playing) iframeRef.current?.focus();
  }, [playing]);

  if (!isYouTubeId(id)) return null;

  return (
    <div className="relative aspect-video bg-background">
      {playing ? (
        <iframe
          ref={iframeRef}
          src={youTubeEmbedUrl(id)}
          title={title}
          allow={IFRAME_PERMISSIONS}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          aria-label={`Play video: ${title}`}
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex items-center justify-center focus-visible:outline-offset-[-4px]"
        >
          <Image src={youTubeThumbnail(id)} alt="" fill sizes={sizes} className="object-cover" />
          <span className="relative flex size-14 items-center justify-center border border-primary bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-background group-focus-visible:bg-primary group-focus-visible:text-background">
            <PlayIcon className="size-6" />
          </span>
        </button>
      )}
    </div>
  );
}
