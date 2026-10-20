# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Website for ZŠ Kostelec nad Orlicí (a Czech primary school):

- **`app/`** — Next.js site with an embedded Payload CMS (Postgres, S3/R2 storage), deployed on Vercel. See `app/CLAUDE.md` / `app/AGENTS.md` and `app/README.md`.
  - `src/app/(site)/(static)/` — static pages kept in code (edited via PRs, not the CMS).
  - `src/app/(site)/[[...slug]]/` — catch-all route for CMS content.
  - `src/app/(payload)/` and `src/cms/` — Payload admin, collections, access and revalidation.
- **`media-worker/`** — Cloudflare Worker: read-only public gateway to the `zskostelec-media` R2 bucket (`npx wrangler deploy` from `media-worker/`).
- `CMS_PLAN.md`, `MIGRATION_PLAN.md` — plans for leaving WordPress and the Gatsby → Next.js rewrite.

The legacy Gatsby frontend (`web/`) and headless WordPress theme (`admin/`) were removed from the repo; comments in `app/` that reference their paths point into git history.

## Commands (run from `app/`)

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`, `npm test` (Vitest), `npm run test:watch`
- `npm run generate:types` — regenerate `src/payload-types.ts`
- `npm run generate:importmap` — regenerate the Payload admin import map

Database dumps (`*.sql`) contain personal data and are git-ignored — never commit them.
