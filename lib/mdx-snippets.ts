export type SnippetImage = { src: string; alt: string };

// Attribute values can hold quotes and ampersands, which would end the string early.
function attribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function figureTag({ src, alt }: SnippetImage, extra = ""): string {
  return `<Figure src="${attribute(src)}" alt="${attribute(alt)}"${extra} />`;
}

export function figureSnippet(image: SnippetImage, caption: string, size: string): string {
  const captionProp = caption ? ` caption="${attribute(caption)}"` : "";
  const sizeProp = size === "normal" ? "" : ` size="${size}"`;
  return figureTag(image, `${captionProp}${sizeProp}`);
}

export function imageGridSnippet(images: SnippetImage[], cols: number): string {
  const figures = images.map((image) => `  ${figureTag(image)}`).join("\n");
  return `<ImageGrid cols={${cols}}>\n${figures}\n</ImageGrid>`;
}

export function gallerySnippet(images: SnippetImage[]): string {
  const rows = images
    .map(({ src, alt }) => `  { src: ${JSON.stringify(src)}, alt: ${JSON.stringify(alt)} },`)
    .join("\n");
  return `<Gallery images={[\n${rows}\n]} />`;
}

export function buttonSnippet(href: string, label: string, variant: string): string {
  return `<Button href="${attribute(href)}" label="${attribute(label)}" variant="${variant}" />`;
}

export function youTubeSnippet(id: string, title: string): string {
  return `<YouTube id="${id}" title="${attribute(title)}" />`;
}
