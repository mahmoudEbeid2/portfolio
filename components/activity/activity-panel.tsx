import type { Activity } from "@/lib/activity";
import { CountUp } from "./count-up";
import { Heatmap } from "./heatmap";

/** Bordered panel with the contribution heatmap and whichever stats are available. */
export function ActivityPanel({ activity }: { activity: Activity }) {
  const { calendar, stats } = activity;

  return (
    <aside aria-label="Live activity" className="min-w-0 border border-line">
      <p className="border-b border-line p-2 font-semibold text-white">
        <span className="text-primary">#</span>live-activity
      </p>
      {calendar && <Heatmap calendar={calendar} />}
      {stats.length > 0 && (
        <dl className="flex flex-wrap gap-px bg-line [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="flex min-w-[120px] flex-1 flex-col-reverse justify-end bg-background p-2"
            >
              <dt className="text-sm">{label}</dt>
              <dd className="text-2xl font-medium text-white">
                <CountUp value={value} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}
