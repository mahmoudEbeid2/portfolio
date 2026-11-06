"use client";

import { useEffect, useState, type RefObject } from "react";

/** Tracks whether an element is on screen, so its animation can pause when it isn't. */
export function useOnScreen(ref: RefObject<HTMLElement | null>): boolean {
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry?.isIntersecting ?? false),
      { threshold: 0.2 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return onScreen;
}
