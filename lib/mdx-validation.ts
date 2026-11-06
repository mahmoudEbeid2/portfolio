import { compile, evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { isYouTubeId } from "@/lib/youtube";

type EstreeNode = {
  type: string;
  value?: unknown;
  elements?: (EstreeNode | null)[];
  properties?: EstreeNode[];
  key?: { name?: string; value?: unknown };
  expression?: EstreeNode;
  body?: EstreeNode[];
};

type MdxAttribute = {
  type: string;
  name?: string;
  value?: string | { value: string; data?: { estree?: EstreeNode } } | null;
};

type MdxNode = {
  type: string;
  name?: string | null;
  url?: string;
  alt?: string | null;
  attributes?: MdxAttribute[];
  children?: MdxNode[];
};

/** Components available in project bodies; see `components/projects/mdx-components.tsx`. */
const ALLOWED_COMPONENTS = ["YouTube", "Figure", "ImageGrid", "Gallery", "Button"];

const FIGURE_SIZES = ["small", "normal", "wide"];
const BUTTON_VARIANTS = ["primary", "secondary"];
const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/;

function attributeOf(node: MdxNode, name: string): MdxAttribute | undefined {
  return node.attributes?.find((item) => item.name === name);
}

function stringProp(node: MdxNode, name: string): string | null {
  const value = attributeOf(node, name)?.value;
  return typeof value === "string" ? value : null;
}

function expressionProp(node: MdxNode, name: string): string | null {
  const value = attributeOf(node, name)?.value;
  return typeof value === "object" && value !== null ? value.value.trim() : null;
}

/** next/image throws on any host it isn't told about, so only this account's images pass. */
function isDeliverableImage(src: string): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "[a-z0-9_-]+";
  return new RegExp(`^https://res\\.cloudinary\\.com/${cloudName}/image/upload/`).test(src);
}

function checkImage(src: string | null, alt: string | null, name: string): void {
  if (!src || !isDeliverableImage(src)) {
    throw new Error(`${name} needs an image uploaded to Cloudinary. Use the editor toolbar.`);
  }
  if (!alt?.trim()) throw new Error(`${name} needs alt text describing the image.`);
}

function checkYouTube(node: MdxNode): void {
  if (!isYouTubeId(stringProp(node, "id") ?? "")) {
    throw new Error('<YouTube> needs id="..." with the 11-character video ID.');
  }
  if (!stringProp(node, "title")?.trim()) {
    throw new Error('<YouTube> needs a title="...".');
  }
}

function checkFigure(node: MdxNode): void {
  checkImage(stringProp(node, "src"), stringProp(node, "alt"), "<Figure>");
  const size = stringProp(node, "size");
  if (size !== null && !FIGURE_SIZES.includes(size)) {
    throw new Error(`<Figure> size must be one of: ${FIGURE_SIZES.join(", ")}.`);
  }
}

function checkImageGrid(node: MdxNode): void {
  const cols = expressionProp(node, "cols");
  if (cols !== "2" && cols !== "3") throw new Error("<ImageGrid> needs cols={2} or cols={3}.");

  const figures = node.children ?? [];
  if (figures.length === 0 || figures.some(({ name }) => name !== "Figure")) {
    throw new Error("<ImageGrid> can only contain <Figure> images.");
  }
}

function literalProps(node: EstreeNode | null): Record<string, unknown> {
  const entries = (node?.properties ?? []).map(({ key, value }) => [
    key?.name ?? key?.value,
    (value as EstreeNode | undefined)?.value,
  ]);
  return Object.fromEntries(entries);
}

function checkGallery(node: MdxNode): void {
  const value = attributeOf(node, "images")?.value;
  const estree = typeof value === "object" ? value?.data?.estree : undefined;
  const list = estree?.body?.[0]?.expression;
  if (list?.type !== "ArrayExpression" || !list.elements?.length) {
    throw new Error('<Gallery> needs images={[{ src: "...", alt: "..." }]}.');
  }

  for (const element of list.elements) {
    const { src, alt } = literalProps(element);
    checkImage(typeof src === "string" ? src : null, typeof alt === "string" ? alt : null, "<Gallery>");
  }
}

function checkButton(node: MdxNode): void {
  if (!SAFE_LINK.test(stringProp(node, "href") ?? "")) {
    throw new Error('<Button> needs href="..." with a full URL or a /path.');
  }
  if (!stringProp(node, "label")?.trim()) throw new Error('<Button> needs a label="...".');

  const variant = stringProp(node, "variant");
  if (variant !== null && !BUTTON_VARIANTS.includes(variant)) {
    throw new Error(`<Button> variant must be one of: ${BUTTON_VARIANTS.join(", ")}.`);
  }
}

const componentChecks: Record<string, (node: MdxNode) => void> = {
  YouTube: checkYouTube,
  Figure: checkFigure,
  ImageGrid: checkImageGrid,
  Gallery: checkGallery,
  Button: checkButton,
};

function checkNode(node: MdxNode): void {
  const isJsx = node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
  const name = node.name ?? "";

  if (node.type === "image") checkImage(node.url ?? null, node.alt ?? null, "A Markdown image");

  if (isJsx && name === "img") {
    throw new Error("Use <Figure> instead of <img>, so the image loads through next/image.");
  }

  // Lowercase tags are plain HTML. Capitalized ones must exist or the page crashes.
  if (isJsx && /^[A-Z]/.test(name)) {
    if (!ALLOWED_COMPONENTS.includes(name)) {
      throw new Error(`Unknown component <${name}>. Use: ${ALLOWED_COMPONENTS.join(", ")}.`);
    }
    componentChecks[name]?.(node);
  }
  node.children?.forEach(checkNode);
}

function remarkCheckComponents() {
  return (tree: unknown) => checkNode(tree as MdxNode);
}

const stubComponents = Object.fromEntries(ALLOWED_COMPONENTS.map((name) => [name, () => null]));

/** Returns why this MDX can't be rendered, or `null` if it's safe to publish. */
export async function validateMdx(source: string): Promise<string | null> {
  try {
    await compile(source, { remarkPlugins: [remarkCheckComponents] });
    const { default: Content } = await evaluate(source, runtime);
    Content({ components: stubComponents });
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "The body isn't valid MDX.";
  }
}
