import { Container } from "@/components/ui/container";
import { DotGrid } from "@/components/ui/dot-grid";
import { OutlineSquare } from "@/components/ui/outline-square";
import { SectionTitle } from "@/components/ui/section-title";
import type { SkillGroup } from "@/lib/content";
import { SkillBox } from "./skill-box";

function SkillsDecor() {
  return (
    <div aria-hidden="true" className="relative hidden h-72 w-[350px] shrink-0 lg:block">
      <DotGrid cols={4} rows={4} className="absolute top-6 left-6" />
      <DotGrid cols={5} rows={5} className="absolute top-36 left-40" />
      <OutlineSquare size={86} className="absolute top-40 left-2" />
      <OutlineSquare size={86} className="absolute top-2 right-6" />
      <OutlineSquare size={52} tone="primary" className="absolute right-0 bottom-0" />
    </div>
  );
}

export function Skills({ groups }: { groups: readonly SkillGroup[] }) {
  return (
    <section aria-labelledby="skills" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="skills" name="skills" />
        <div className="flex gap-12">
          <SkillsDecor />
          <ul className="grid flex-1 content-start gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
            {groups.map((group) => (
              <SkillBox key={group.name} group={group} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
