import { z } from "zod";
import type { Profile } from "@/lib/content";
import { githubUsername } from "@/lib/site";

/**
 * Live numbers for the about section, fetched on the server and cached for a
 * day. Every source fails quietly to `null` so its part of the panel hides.
 */
const REVALIDATE_SECONDS = 86400;
const TIMEOUT_MS = 8000;
const NPM_PACKAGE = "egypt-natid";

const contributionLevels = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

const contributionDaySchema = z.object({
  date: z.string(),
  weekday: z.number(),
  contributionCount: z.number(),
  contributionLevel: z.enum(contributionLevels),
});

const githubSchema = z.object({
  data: z.object({
    user: z.object({
      repositories: z.object({ totalCount: z.number() }),
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          totalContributions: z.number(),
          weeks: z.array(z.object({ contributionDays: z.array(contributionDaySchema) })),
        }),
      }),
    }),
  }),
});

const npmSchema = z.object({ downloads: z.number() });

const youtubeSchema = z.object({
  items: z.array(
    z.object({
      statistics: z.object({
        subscriberCount: z.coerce.number().optional(),
        hiddenSubscriberCount: z.boolean(),
      }),
    }),
  ),
});

const GITHUB_QUERY = `query ($login: String!) {
  user(login: $login) {
    repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date weekday contributionCount contributionLevel } }
      }
    }
  }
}`;

export type ContributionDay = {
  date: string;
  weekday: number;
  count: number;
  /** 0 (none) to 4 (busiest quartile). */
  level: number;
};

export type ContributionCalendar = {
  total: number;
  weeks: ContributionDay[][];
};

export type ActivityStat = {
  label: string;
  value: number;
};

export type Activity = {
  calendar: ContributionCalendar | null;
  stats: ActivityStat[];
};

async function fetchJson<T>(
  source: string,
  url: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    return schema.parse(await response.json());
  } catch (error) {
    // Logs the source, never the URL: the YouTube one carries the API key.
    const reason = error instanceof z.ZodError ? "unexpected response" : (error as Error).message;
    console.warn(`Activity source failed (${source}): ${reason}`);
    return null;
  }
}

async function fetchGithub() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const result = await fetchJson("github", "https://api.github.com/graphql", githubSchema, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: GITHUB_QUERY, variables: { login: githubUsername } }),
  });
  if (!result) return null;

  const { repositories, contributionsCollection } = result.data.user;
  const { totalContributions, weeks } = contributionsCollection.contributionCalendar;
  return {
    repos: repositories.totalCount,
    calendar: {
      total: totalContributions,
      weeks: weeks.map(({ contributionDays }) =>
        contributionDays.map(({ date, weekday, contributionCount, contributionLevel }) => ({
          date,
          weekday,
          count: contributionCount,
          level: contributionLevels.indexOf(contributionLevel),
        })),
      ),
    },
  };
}

async function fetchNpmDownloads(): Promise<number | null> {
  const url = `https://api.npmjs.org/downloads/point/last-month/${NPM_PACKAGE}`;
  const result = await fetchJson("npm", url, npmSchema);
  return result?.downloads ?? null;
}

async function fetchYoutubeSubscribers(): Promise<number | null> {
  const key = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!key || !channelId) return null;

  const params = new URLSearchParams({ part: "statistics", id: channelId, key });
  const url = `https://www.googleapis.com/youtube/v3/channels?${params}`;
  const result = await fetchJson("youtube", url, youtubeSchema);

  const statistics = result?.items[0]?.statistics;
  if (!statistics || statistics.hiddenSubscriberCount) return null;
  return statistics.subscriberCount ?? null;
}

function stat(label: string, enabled: boolean, value: number | null | undefined) {
  return enabled && value ? [{ label, value }] : [];
}

/** Everything the panel can show right now. Zero counts are left out on purpose. */
export async function getActivity(profile: Profile): Promise<Activity> {
  const [github, npmDownloads, youtubeSubscribers] = await Promise.all([
    fetchGithub(),
    profile.showNpmStat ? fetchNpmDownloads() : null,
    profile.showYoutubeStat ? fetchYoutubeSubscribers() : null,
  ]);

  return {
    calendar: github?.calendar ?? null,
    stats: [
      ...stat("public repos", profile.showRepoStat, github?.repos),
      ...stat("npm downloads (30d)", profile.showNpmStat, npmDownloads),
      ...stat("YouTube subscribers", profile.showYoutubeStat, youtubeSubscribers),
    ],
  };
}
