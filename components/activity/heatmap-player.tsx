"use client";

import { useRef, type ReactNode } from "react";
import { useOnScreen } from "./use-on-screen";

/** Runs the heatmap's CSS fill animation only while it's on screen. */
export function HeatmapPlayer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const playing = useOnScreen(ref);

  return (
    <div ref={ref} data-playing={playing} className="heatmap">
      {children}
    </div>
  );
}
