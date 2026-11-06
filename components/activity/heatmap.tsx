import type { CSSProperties } from "react";
import type { ContributionCalendar } from "@/lib/activity";
import { HeatmapPlayer } from "./heatmap-player";

const CELL = 10;
const PITCH = 12;
const FILL_MS = 1800;

function contributions(count: number): string {
  return `${count.toLocaleString("en-US")} contribution${count === 1 ? "" : "s"}`;
}

export function Heatmap({ calendar }: { calendar: ContributionCalendar }) {
  const { total, weeks } = calendar;
  const width = weeks.length * PITCH - (PITCH - CELL);
  const height = 7 * PITCH - (PITCH - CELL);
  const activeDays = weeks.flat().filter(({ level }) => level > 0).length;
  const summary = `${contributions(total)} in the last year`;
  let filled = 0;

  return (
    <div className="flex flex-col gap-2 p-4">
      <HeatmapPlayer>
        {/* The viewBox sets the height before anything loads, so nothing shifts. */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`GitHub contribution heatmap: ${summary}`}
          className="block w-full"
          style={{ "--heat-step": `${FILL_MS / Math.max(activeDays, 1)}ms` } as CSSProperties}
        >
          {weeks.map((days, week) =>
            days.map(({ date, weekday, count, level }) => (
              <rect
                key={date}
                x={week * PITCH}
                y={weekday * PITCH}
                width={CELL}
                height={CELL}
                data-level={level}
                className="heat-cell"
                style={level > 0 ? ({ "--i": filled++ } as CSSProperties) : undefined}
              >
                <title>{`${contributions(count)} on ${date}`}</title>
              </rect>
            )),
          )}
        </svg>
      </HeatmapPlayer>
      <p className="text-sm">{summary}</p>
    </div>
  );
}
