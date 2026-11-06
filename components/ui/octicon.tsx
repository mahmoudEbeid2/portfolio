import octicons from "@primer/octicons";

type OcticonProps = {
  name: "mark-github" | "code";
};

/** An Octicons glyph as inline SVG, sized by its container. */
export function Octicon({ name }: OcticonProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className="relative block aspect-square w-full"
      dangerouslySetInnerHTML={{ __html: octicons[name].heights[24]?.path ?? "" }}
    />
  );
}
