# Mahmoud Ebeid — Portfolio

Personal portfolio of Mahmoud Ebeid, backend engineer and full-stack developer based in Cairo.

Built with Next.js (App Router), TypeScript, Tailwind CSS and MongoDB. Public pages are static;
content lives in MongoDB Atlas and is edited in a custom dashboard at `/admin`. Every save
revalidates the affected pages, so changes go live without a redeploy.

## Tech stack

| Layer        | Choice                                                               |
| ------------ | -------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router) + TypeScript (strict)                        |
| Styling      | Tailwind CSS v4, Fira Code via `next/font`, dark and light themes    |
| Database     | MongoDB Atlas + Mongoose                                             |
| Auth         | Auth.js v5 with GitHub, restricted to `ADMIN_EMAIL`                  |
| Media        | Cloudinary signed uploads from the browser                           |
| Validation   | Zod schemas shared by forms and server actions                       |
| MDX          | `@mdx-js/mdx` (project case studies)                                 |
| Contact form | Server Action + Zod, saved to MongoDB, optional email through Resend |
| Analytics    | Vercel Analytics                                                     |
| Quality      | ESLint + Prettier                                                    |

## Requirements

- Node.js 20.19+
- pnpm
- A MongoDB Atlas cluster, a GitHub OAuth app and a Cloudinary account

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill it in
pnpm dev
```

- Site: http://localhost:3000
- Dashboard: http://localhost:3000/admin

`pnpm build` reads content from MongoDB, so it needs `MONGODB_URI`.

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
  admin/               Dashboard: login page and protected (dashboard) routes
  api/auth/            Auth.js routes
  opengraph-image.tsx  Default OG image (projects have their own)
  sitemap.ts, robots.ts, icon.svg, apple-icon.tsx
components/
  ui/                  Design system (Button, Card, SectionTitle, DotGrid, icons…)
  layout/              Header, mobile menu, theme toggle, side social bar, footer
  sections/            Home page sections
  admin/               Dashboard shell, editors, fields, toasts and dialogs
  projects/ about/ contact/ seo/
lib/
  content.ts           Typed, cached content reads for public pages
  schemas.ts           Zod schemas shared by forms, actions and models
  cache-tags.ts        Cache tags that dashboard saves invalidate
  db/                  Cached Mongoose connection and models
  admin/               Dashboard queries and server actions
  auth/                Admin checks used by the proxy, pages and actions
  contact.ts           Contact form schema and types
  seo.ts, og.tsx, site-url.ts, site.ts, cn.ts
auth.ts                Auth.js configuration
proxy.ts               Redirects signed-out visitors away from /admin
```

## Editing content

Sign in at `/admin` with the GitHub account that owns `ADMIN_EMAIL`:

- **Projects** — create, edit, delete, filter by category, drag to reorder, draft/published,
  featured, open source, cover, gallery and a Markdown/MDX body with preview. Only published
  projects are shown. A project shows as live when it has a demo URL. The home page shows the top
  three per category, featured ones first.
- **Project videos** — paste any YouTube URL in the project's Videos section; only the video ID is
  stored. Videos appear in the `#demo` section, and project bodies can embed one with
  `<YouTube id="..." title="..." />`. Players load from youtube-nocookie.com only on click.
- **Activities** — competitions, volunteering, community work, talks, certificates and design.
  Create, edit, delete, filter by type, drag to reorder, draft/published, featured, cover and a
  multi-image gallery. The home page shows up to 3 featured items per type, and `/activities` lists
  everything newest first.
- **Experience, Skills, Education & Courses, Fun facts** — add, edit, delete and reorder.
- **Profile** — name, roles, bio, photos, CV link, social links and the home page quote.
- **Messages** — everything sent through the contact form.

Images and the CV upload straight from the browser to Cloudinary, using a signature from a server
action, so the files never pass through Vercel. Without the Cloudinary variables, uploads show a
clear message and the rest of the dashboard keeps working. Image uploads are limited to 10MB in JPG,
PNG, WebP or AVIF, and CV uploads to 10MB PDFs.

CV uploads need PDF delivery turned on in Cloudinary (Settings > Security > PDF and ZIP files
delivery). The dashboard checks this after each upload and explains what to do if it's off.

Components never query the database directly. Public pages go through `lib/content.ts`, whose reads
are cached and tagged; every dashboard save expires the matching tag.

## Environment variables

See [`.env.example`](./.env.example).

| Variable                | Required   | Purpose                                                     |
| ----------------------- | ---------- | ----------------------------------------------------------- |
| `MONGODB_URI`           | Yes        | MongoDB Atlas connection string, also used at build time    |
| `ADMIN_EMAIL`           | Yes        | The only account allowed in; must be verified on GitHub     |
| `AUTH_SECRET`           | Yes        | Signs sessions (`openssl rand -base64 32`)                  |
| `AUTH_GITHUB_ID`        | Yes        | GitHub OAuth app client ID                                  |
| `AUTH_GITHUB_SECRET`    | Yes        | GitHub OAuth app client secret                              |
| `CLOUDINARY_CLOUD_NAME` | Yes        | Cloudinary account, also read at build time by `next/image` |
| `CLOUDINARY_API_KEY`    | Yes        | Signs uploads                                               |
| `CLOUDINARY_API_SECRET` | Yes        | Signs uploads; server only                                  |
| `NEXT_PUBLIC_SITE_URL`  | Production | Absolute site URL for metadata, sitemap and OG images       |
| `RESEND_API_KEY`        | Optional   | Enables an email copy of each contact message               |
| `CONTACT_TO_EMAIL`      | Optional   | Where those emails are delivered                            |
| `CONTACT_FROM_EMAIL`    | Optional   | Sender on a Resend-verified domain                          |
| `GITHUB_TOKEN`          | Optional   | Read-only token for the heatmap and public repo count       |
| `YOUTUBE_API_KEY`       | Optional   | YouTube Data API v3 key for the subscriber count            |
| `YOUTUBE_CHANNEL_ID`    | Optional   | The channel to count (starts with `UC`)                     |

## Deployment (Vercel)

1. Import the repository in Vercel (framework preset: Next.js, package manager: pnpm).
2. In MongoDB Atlas → Network Access, allow connections from Vercel. Hobby deployments have no fixed
   IPs, so this means `0.0.0.0/0`, which makes a strong database password essential.
3. Create a GitHub OAuth app for production. A GitHub OAuth app has one callback URL, so production
   needs its own app, with `https://<your-domain>/api/auth/callback/github` as the callback.
4. Add the environment variables above to Vercel.
5. Deploy. Vercel Analytics starts collecting once it's enabled for the project in the dashboard.

## Content TODOs

Placeholders still marked `TODO(mahmoud)`, all editable in the dashboard:

- Hero and about photos (Profile). Without them the hero shows the GitHub mark, the about
  section shows the coffee mark and the about page shows the live activity panel
- Current company name, location and dates (Experience)
- The Turkish company name, role and dates (Experience)
- The Dokany GitHub link, if the repo is public, and a new live URL (the old domain no longer
  serves Dokany, so all its links were removed)
- Missing case-study facts (Projects: roles, timelines, results)
