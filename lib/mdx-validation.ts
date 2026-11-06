import { compile, evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { isYouTubeId } from "@/lib/youtube";

type MdxAttribute = { type: string; name?: string; value?: unknown };
type MdxNode = {
  type: string;
  name?: string | null;
  attributes?: MdxAttribute[];
  children?: MdxNode[];
};

/** Components available in project bodies; see `components/projects/mdx-content.tsx`. */
const ALLOWED_COMPONENTS = new Set(["YouTube"]);

function stringProp(node: MdxNode, name: string): string | null {
  const attribute = node.attributes?.find((item) => item.name === name);
  return typeof attribute?.value === "string" ? attribute.value : null;
}

function checkYouTube(node: MdxNode): void {
  if (!isYouTubeId(stringProp(node, "id") ?? "")) {
    throw new Error('<YouTube> needs id="..." with the 11-character video ID.');
  }
  if (!stringProp(node, "title")?.trim()) {
    throw new Error('<YouTube> needs a title="...".');
  }
}

function checkComponents(node: MdxNode): void {
  const isJsx = node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
  const name = node.name ?? "";

  // Lowercase tags are plain HTML. Capitalized ones must exist or the page crashes.
  if (isJsx && /^[A-Z]/.test(name)) {
    if (!ALLOWED_COMPONENTS.has(name)) throw new Error(`Unknown component <${name}>.`);
    if (name === "YouTube") checkYouTube(node);
  }
  node.children?.forEach(checkComponents);
}

function remarkCheckComponents() {
  return (tree: unknown) => checkComponents(tree as MdxNode);
}

/** Returns why this MDX can't be rendered, or `null` if it's safe to publish. */
export async function validateMdx(source: string): Promise<string | null> {
  try {
    await compile(source, { remarkPlugins: [remarkCheckComponents] });
    const { default: Content } = await evaluate(source, runtime);
    Content({ components: { YouTube: () => null } });
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "The body isn't valid MDX.";
  }
}
