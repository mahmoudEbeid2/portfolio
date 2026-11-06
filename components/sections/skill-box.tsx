import { Card } from "@/components/ui/card";
import type { SkillGroup } from "@/lib/content";

export function SkillBox({ group }: { group: SkillGroup }) {
  return (
    <Card as="li">
      <h3 className="border-b border-line p-2 font-semibold">{group.name}</h3>
      <p className="p-2">{group.items.join(" ")}</p>
    </Card>
  );
}
