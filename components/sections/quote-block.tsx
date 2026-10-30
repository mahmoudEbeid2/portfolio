import { Container } from "@/components/ui/container";
import type { Quote } from "@/lib/content";

function QuoteMark({ mark, className }: { mark: string; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute bg-background px-2 font-sans text-6xl leading-none text-gray ${className}`}
    >
      {mark}
    </span>
  );
}

export function QuoteBlock({ quote }: { quote: Quote }) {
  return (
    <section aria-label="Quote" className="py-12">
      <Container>
        <figure className="mx-auto flex w-fit max-w-full flex-col items-end">
          <blockquote className="relative border border-gray px-6 py-8 text-xl font-medium text-white sm:text-2xl">
            <QuoteMark mark="“" className="-top-5 left-3" />
            <p>{quote.text}</p>
            <QuoteMark mark="”" className="right-3 -bottom-8" />
          </blockquote>
          <figcaption className="border-x border-b border-gray p-4 text-xl text-white sm:text-2xl">
            - {quote.author}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
