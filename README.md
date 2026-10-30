# Mahmoud Ebeid — Portfolio

Personal portfolio of Mahmoud Ebeid, backend engineer and full-stack developer based in Cairo.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Keystatic. All pages are statically
generated; content lives in this repo as JSON and MDX and is edited through a Keystatic dashboard.

## Tech stack

| Layer               | Choice                                              |
| ------------------- | --------------------------------------------------- |
| Framework           | Next.js 16 (App Router) + TypeScript (strict)       |
| Styling             | Tailwind CSS v4, Fira Code via `next/font`          |
| Content + dashboard | Keystatic (local in dev, GitHub in production)      |
| MDX                 | `@mdx-js/mdx` (project case studies)                |
| Contact form        | Server Action + Zod + Resend, with a honeypot field |
| Analytics           | Vercel Analytics                                    |
| Quality             | ESLint + Prettier                                   |

## Requirements

- Node.js 20+
- pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

- Site: http://localhost:3000
- Content dashboard: http://localhost:3000/keystatic

## Scripts

| Script              | Description                       |
| ------------------- | --------------------------------- |
| `pnpm dev`          | Start the dev server              |
| `pnpm build`        | Production build                  |
| `pnpm start`        | Serve the production build        |
| `pnpm lint`         | Run ESLint                        |
| `pnpm typecheck`    | Generate route types and run tsc  |
| `pnpm format`       | Format the codebase with Prettier |
| `pnpm format:check` | Check formatting                  |

## Project structure

```
app/
  (site)/              Public pages (home, projects, project details, about, contacts)
  keystatic/           Content dashboard UI
  api/keystatic/       Content dashboard API
  opengraph-image.tsx  Default OG image (projects have their own)
  sitemap.ts, robots.ts, icon.svg, apple-icon.tsx
components/
  ui/                  Design system (Button, Card, SectionTitle, DotGrid, icons…)
  layout/              Header, mobile menu, side social bar, footer, site shell
  sections/            Home page sections
  projects/ about/ contact/ seo/
content/               Site content (JSON singletons + MDX projects)
lib/
  content.ts           Typed content access — the only place that reads content
  contact.ts           Contact form schema and types
  seo.ts, og.tsx, site-url.ts, site.ts, cn.ts
public/images/         Project and profile images
keystatic.config.ts    Content schemas
```

## Editing content

All content is managed in the Keystatic dashboard at `/keystatic`:

- **Profile** — name, roles, headline, bio, photos, "currently working on", CV link, socials.
- **Skills, Experience, Education, Courses, Fun facts, Quote** — the rest of the about content.
- **Projects** — one MDX entry per project with summary, category (`complete-app` or
  `small-project`), featured flag, order, cover, gallery, stack, role, timeline, links and status.
  Only `published` projects are shown; the first three `featured` ones appear on the home page.

Locally, the dashboard writes straight to the files in `content/` and `public/images/`, so commit
the changes like any other edit. In production (GitHub mode), every save becomes a commit on
GitHub, which triggers a new Vercel deployment.

Components never read content files directly — everything goes through `lib/content.ts`.

## Environment variables

See [`.env.example`](./.env.example).

| Variable                                | Required             | Purpose                                                  |
| --------------------------------------- | -------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                  | Production           | Absolute site URL for metadata, sitemap and OG images    |
| `RESEND_API_KEY`                        | For the contact form | Resend API key                                           |
| `CONTACT_TO_EMAIL`                      | For the contact form | Where contact messages are delivered                     |
| `CONTACT_FROM_EMAIL`                    | Optional             | Sender on a Resend-verified domain                       |
| `KEYSTATIC_GITHUB_CLIENT_ID`            | GitHub mode          | Keystatic GitHub app client ID                           |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`        | GitHub mode          | Keystatic GitHub app client secret                       |
| `KEYSTATIC_SECRET`                      | GitHub mode          | Random secret used to sign Keystatic sessions            |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | GitHub mode          | GitHub app slug; setting it switches Keystatic to GitHub |

Without the contact variables the form shows a friendly "email me directly" message. Without the
Keystatic variables, production builds still work and the dashboard falls back to local mode.

## Deployment (Vercel)

1. Import the repository in Vercel (framework preset: Next.js, package manager: pnpm).
2. Set `NEXT_PUBLIC_SITE_URL` and the Resend variables.
3. Set up Keystatic GitHub mode:
   1. Create a GitHub App (GitHub → Settings → Developer settings → GitHub Apps) with:
      - Callback URL: `https://<your-domain>/api/keystatic/github/oauth/callback`
      - "Request user authorization (OAuth) during installation" enabled
      - Repository permissions: Contents (read & write), Metadata (read), Pull requests (read & write)
   2. Install the app on this repository.
   3. Add the four `KEYSTATIC_*` variables to Vercel: the app's client ID and a client secret, a
      random `KEYSTATIC_SECRET` (e.g. `openssl rand -hex 32`), and the app's slug.
4. Deploy. Vercel Analytics starts collecting once it's enabled for the project in the dashboard.

## Content TODOs

Placeholders still marked `TODO(mahmoud)` in the content:

- Hero and about photos (`public/images/profile/`, via the Profile singleton)
- Current company name, location and dates (Experience)
- The Turkish company name, role and dates (Experience)
- The "currently working on" project (Profile)
- The egypt-natid npm URL (add it under the project's other links)
- The Dokany GitHub link, if the repo is public
