"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { chipClasses } from "./chip-classes";

type TabItem = {
  key: string;
  label: string;
};

type TabsProps = {
  label: string;
  tabs: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  /** Controls beside the tab list, such as a filter toggle. */
  extra?: ReactNode;
  children: ReactNode;
};

/** Accessible tabs: arrow keys, Home and End move between them. */
export function Tabs({ label, tabs, activeKey, onSelect, extra, children }: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    tabs.findIndex(({ key }) => key === activeKey),
    0,
  );

  function moveTo(index: number) {
    const tab = tabs[index];
    if (!tab) return;
    onSelect(tab.key);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const targets: Record<string, number> = {
      ArrowRight: (activeIndex + 1) % tabs.length,
      ArrowLeft: (activeIndex - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    moveTo(next);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <div
          ref={listRef}
          role="tablist"
          aria-label={label}
          onKeyDown={onKeyDown}
          className="flex flex-wrap gap-2"
        >
          {tabs.map(({ key, label: tabLabel }, index) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={index === activeIndex}
              aria-controls={`${baseId}-panel`}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => onSelect(key)}
              className={chipClasses(index === activeIndex)}
            >
              {tabLabel}
            </button>
          ))}
        </div>
        {extra}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${activeIndex}`}>
        {children}
      </div>
    </div>
  );
}

type PanelTabsProps = {
  label: string;
  tabs: (TabItem & { panel: ReactNode })[];
};

/** Tabs that keep their own state and show a prebuilt panel for each. */
export function PanelTabs({ label, tabs }: PanelTabsProps) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? "");

  return (
    <Tabs label={label} tabs={tabs} activeKey={activeKey} onSelect={setActiveKey}>
      {tabs.find(({ key }) => key === activeKey)?.panel}
    </Tabs>
  );
}
