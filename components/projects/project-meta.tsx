import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/content";
import { projectCategoryLabels } from "@/lib/project-filters";

export function ProjectMeta({ project }: { project: Project }) {
  const { role, category, isTeamProject, timeline, stack } = project;
  const rows = [
    { label: "role", value: role },
    {
      label: "type",
      value: `${projectCategoryLabels[category]} · ${isTeamProject ? "Team" : "Solo"}`,
    },
    { label: "timeline", value: timeline },
  ].filter((row) => row.value);

  return (
    <dl className="grid border border-line sm:grid-cols-[max-content_1fr]">
      {rows.map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="border-line px-4 pt-3 text-white sm:border-b sm:py-3">{label}</dt>
          <dd className="border-b border-line px-4 pb-3 sm:pt-3">{value}</dd>
        </div>
      ))}
      {stack.length > 0 && (
        <div className="contents">
          <dt className="px-4 pt-3 text-white sm:py-3">stack</dt>
          <dd className="px-4 pt-2 pb-3 sm:pt-3">
            <ul className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
    </dl>
  );
}
