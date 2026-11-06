"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { chipClasses } from "./chip-classes";

export type ActivityTab = {
  key: string;
  label: string;
  panel: ReactNode;
};

export function ActivityTabs({ tabs }: { tabs: ActivityTab[] }) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function select(next: number) {
    setActive(next);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const targets: Record<string, number> = {
      ArrowRight: (active + 1) % tabs.length,
      ArrowLeft: (active - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  }

  const current = tabs[active];

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Activity types"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {tabs.map(({ key, label }, index) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={chipClasses(index === active)}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`}>
        {current?.panel}
      </div>
    </div>
  );
}
