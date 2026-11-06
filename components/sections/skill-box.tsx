import { Card } from "@/components/ui/card";
import { SkillLabel } from "@/components/ui/skill-label";
import type { SkillGroup } from "@/lib/content";
import { getSkillIcon } from "@/lib/skill-icons";

export function SkillBox({ group }: { group: SkillGroup }) {
  return (
    <Card as="li">
      <h3 className="border-b border-line p-2 font-semibold">{group.name}</h3>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 p-2">
        {group.items.map(({ name, icon }) => (
          <li key={name}>
            <SkillLabel name={name} icon={getSkillIcon(icon)} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
