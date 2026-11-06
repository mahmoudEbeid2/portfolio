import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "./mdx-components";

/** Compiles and renders a trusted MDX string written in the dashboard. */
export async function MdxContent({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, runtime);
  return <Content components={mdxComponents} />;
}
