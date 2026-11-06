import { evaluate } from "@mdx-js/mdx";
import type { ComponentPropsWithoutRef } from "react";
import * as runtime from "react/jsx-runtime";

function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="text-white underline decoration-primary underline-offset-4 hover:text-primary"
      {...props}
    />
  );
}

type Props<
  T extends "h2" | "h3" | "p" | "ul" | "ol" | "li" | "strong" | "code" | "pre" | "blockquote",
> = ComponentPropsWithoutRef<T>;

const components = {
  h2: (props: Props<"h2">) => (
    <h2 className="mt-12 mb-4 text-2xl font-medium first:mt-0" {...props}>
      <span aria-hidden="true" className="text-primary">
        #
      </span>
      {props.children}
    </h2>
  ),
  h3: (props: Props<"h3">) => <h3 className="mt-8 mb-3 text-xl font-medium" {...props} />,
  p: (props: Props<"p">) => <p className="mb-4" {...props} />,
  ul: (props: Props<"ul">) => <ul className="mb-4 flex flex-col gap-2" {...props} />,
  ol: (props: Props<"ol">) => (
    <ol className="mb-4 flex list-decimal flex-col gap-2 pl-6" {...props} />
  ),
  li: (props: Props<"li">) => (
    <li className="relative pl-6 [ol>&]:pl-0" {...props}>
      <span aria-hidden="true" className="absolute left-0 text-primary [ol>li>&]:hidden">
        &gt;
      </span>
      {props.children}
    </li>
  ),
  a: Anchor,
  strong: (props: Props<"strong">) => <strong className="font-semibold text-white" {...props} />,
  code: (props: Props<"code">) => (
    <code
      className="border border-line px-1 text-white [pre>&]:border-0 [pre>&]:p-0 [pre>&]:text-gray"
      {...props}
    />
  ),
  pre: (props: Props<"pre">) => (
    <pre
      className="mb-6 overflow-x-auto border border-line p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  blockquote: (props: Props<"blockquote">) => (
    <blockquote className="mb-4 border-l border-primary pl-4" {...props} />
  ),
};

/** Compiles and renders a trusted MDX string written in the dashboard. */
export async function MdxContent({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, runtime);
  return <Content components={components} />;
}
