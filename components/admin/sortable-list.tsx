"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SortableListProps<T extends { id: string }> = {
  items: readonly T[];
  label: string;
  disabled?: boolean;
  onReorder: (items: T[]) => void;
  children: (item: T) => ReactNode;
};

function moved<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

const moveButton =
  "flex size-8 items-center justify-center text-gray transition-colors hover:text-white disabled:opacity-40";

/** Drag to reorder, with up/down buttons for keyboard and touch users. */
export function SortableList<T extends { id: string }>({
  items,
  label,
  disabled,
  onReorder,
  children,
}: SortableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function drop(to: number) {
    if (dragIndex !== null && dragIndex !== to) onReorder(moved(items, dragIndex, to));
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable={!disabled}
          onDragStart={() => setDragIndex(index)}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setOverIndex(index);
          }}
          onDrop={(event) => {
            event.preventDefault();
            drop(index);
          }}
          className={cn(
            "flex items-stretch border",
            overIndex === index && dragIndex !== null ? "border-primary" : "border-line",
            dragIndex === index && "opacity-50",
          )}
        >
          <div className="flex flex-col justify-center border-r border-line">
            <button
              type="button"
              aria-label={`Move ${label} up`}
              disabled={disabled || index === 0}
              onClick={() => onReorder(moved(items, index, index - 1))}
              className={moveButton}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Move ${label} down`}
              disabled={disabled || index === items.length - 1}
              onClick={() => onReorder(moved(items, index, index + 1))}
              className={moveButton}
            >
              ↓
            </button>
          </div>
          <div className="min-w-0 flex-1 p-3">{children(item)}</div>
        </li>
      ))}
    </ul>
  );
}
