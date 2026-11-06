import { Container } from "@/components/ui/container";
import { Octicon } from "@/components/ui/octicon";
import { SectionMark, sectionMarkSize } from "@/components/ui/section-mark";
import { SectionTitle } from "@/components/ui/section-title";
import type { SkillGroup } from "@/lib/content";
import { SkillBox } from "./skill-box";

export function Skills({ groups }: { groups: readonly SkillGroup[] }) {
  return (
    <section aria-labelledby="skills" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="skills" name="skills" />
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <SectionMark className={sectionMarkSize}>
            <Octicon name="code" />
          </SectionMark>
          <ul className="grid w-full flex-1 content-start gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
            {groups.map((group) => (
              <SkillBox key={group.name} group={group} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
