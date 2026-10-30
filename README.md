# Mahmoud Ebeid — Portfolio

Personal portfolio of Mahmoud Ebeid, backend engineer and full-stack developer based in Cairo.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Keystatic for content.

> Work in progress — this branch is a rebuild of the old static site.

## Requirements

- Node.js 20+
- pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Script              | Description                       |
| ------------------- | --------------------------------- |
| `pnpm dev`          | Start the dev server              |
| `pnpm build`        | Production build                  |
| `pnpm start`        | Serve the production build        |
| `pnpm lint`         | Run ESLint                        |
| `pnpm typecheck`    | Type-check with TypeScript        |
| `pnpm format`       | Format the codebase with Prettier |
| `pnpm format:check` | Check formatting                  |

## Project structure

```
app/                 Routes (App Router)
components/ui/       Base UI building blocks
components/layout/   Header, footer, navigation
components/sections/ Page sections
lib/                 Shared utilities and content access
content/             Site content (managed with Keystatic)
public/images/       Static images
legacy/              Old site data, kept temporarily for migration
```

## Content editing

_Coming soon — Keystatic admin at `/keystatic`._

## Environment variables

See [`.env.example`](./.env.example).

## Deployment

_Coming soon — Vercel._
