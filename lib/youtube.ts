const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const WATCH_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

/** Path prefixes that are followed by the video ID. */
const ID_PATHS = new Set(["shorts", "embed", "live", "v"]);

export function isYouTubeId(value: string): boolean {
  return VIDEO_ID.test(value);
}

function toUrl(input: string): URL | null {
  const value = input.trim();
  try {
    return new URL(/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }
}

/** Extracts the 11-character video ID from any YouTube URL, or `null` if it isn't one. */
export function parseYouTubeId(input: string): string | null {
  const url = toUrl(input);
  if (!url || (url.protocol !== "https:" && url.protocol !== "http:")) return null;

  const host = url.hostname.toLowerCase();
  const [first, second] = url.pathname.split("/").filter(Boolean);

  let id: string | null | undefined;
  if (host === "youtu.be" || host === "www.youtu.be") id = first;
  else if (!WATCH_HOSTS.has(host)) return null;
  else if (first === "watch") id = url.searchParams.get("v");
  else if (first && ID_PATHS.has(first)) id = second;

  return id && isYouTubeId(id) ? id : null;
}

export function youTubeThumbnail(id: string): string {
  // hqdefault exists for every video; maxresdefault often returns 404.
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
