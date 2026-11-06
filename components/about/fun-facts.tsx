import { Container } from "@/components/ui/container";
import { DotGrid } from "@/components/ui/dot-grid";
import { OutlineSquare } from "@/components/ui/outline-square";
import { SectionTitle } from "@/components/ui/section-title";

export function FunFacts({ facts }: { facts: readonly string[] }) {
  if (facts.length === 0) return null;

  return (
    <section aria-labelledby="my-fun-facts" className="reveal py-12">
      <Container className="flex flex-col gap-12">
        <SectionTitle id="my-fun-facts" name="my-fun-facts" line={false} />
        <div className="flex gap-12">
          <ul className="flex flex-1 flex-wrap content-start gap-4">
            {facts.map((fact) => (
              <li key={fact} className="border border-line p-2">
                {fact}
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="relative hidden h-40 w-44 shrink-0 md:block">
            <DotGrid cols={5} rows={5} className="absolute top-0 left-0" />
            <OutlineSquare size={86} tone="primary" className="absolute right-0 bottom-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
