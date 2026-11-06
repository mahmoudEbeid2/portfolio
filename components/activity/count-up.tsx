"use client";

import { useEffect, useRef } from "react";
import { useOnScreen } from "./use-on-screen";

const DURATION_MS = 1400;

function format(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Counts up to `value` while on screen. The server renders the final number and
 * an invisible copy keeps its width, so reduced motion and layout need no work.
 */
export function CountUp({ value }: { value: number }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const onScreen = useOnScreen(rootRef);

  useEffect(() => {
    const number = numberRef.current;
    if (!number || !onScreen || elapsed.current >= DURATION_MS) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = performance.now();

    function tick(now: number) {
      if (!number) return;
      elapsed.current += now - last;
      last = now;

      const progress = Math.min(elapsed.current / DURATION_MS, 1);
      number.textContent = format(Math.round(value * (1 - (1 - progress) ** 3)));
      number.dataset.started = "true";
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onScreen, value]);

  return (
    <span ref={rootRef} className="inline-grid">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {format(value)}
      </span>
      <span aria-hidden="true" ref={numberRef} className="count-up col-start-1 row-start-1">
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
