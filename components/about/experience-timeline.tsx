import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { ExperienceItem } from "@/lib/content";

export function ExperienceTimeline({ items }: { items: readonly ExperienceItem[] }) {
  return (
    <section aria-labelledby="experience" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="experience" name="experience" />
        <ol className="flex flex-col gap-6 border-l border-primary pl-6">
          {items.map((item) => (
            <li
              key={`${item.role}-${item.company}-${item.start}`}
              className="relative border border-gray"
            >
              <span
                aria-hidden="true"
                className="absolute top-5 -left-[29px] size-2.5 bg-primary"
              />
              <div className="flex flex-col justify-between gap-1 border-b border-gray p-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-xl font-medium">{item.role}</h3>
                  <p>
                    <span className="text-primary">@</span>
                    {item.company}
                    {item.location && <span> · {item.location}</span>}
                  </p>
                </div>
                <p className="shrink-0 text-white">
                  {item.start} — {item.end || "Present"}
                </p>
              </div>
              {item.achievements.length > 0 && (
                <ul className="flex flex-col gap-2 p-4">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="relative pl-6">
                      <span aria-hidden="true" className="absolute left-0 text-primary">
                        &gt;
                      </span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
