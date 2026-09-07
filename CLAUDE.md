# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Website for ZŠ Kostelec nad Orlicí (a Czech primary school), built as a JAMstack site:

- **`admin/`** — Headless WordPress backend (PHP theme + ACF field groups), run via Docker. Content-only: no public-facing templates, it's used purely as a CMS/API for the frontend.
- **`web/`** — Gatsby + TypeScript + React frontend that pulls content from the WordPress REST API at build time and produces a static site.

The two are independently deployed and only connected via the WordPress REST API (`ADMIN_URL`/`ADMIN_PROTOCOL` env vars in `web/`).

## Commands

### web/ (Gatsby frontend)

Run from `web/`:

- `yarn develop` — start dev server at localhost:8000 (pulls live data from the admin WP instance configured in `.env.development.local`)
- `yarn build` — production build
- `yarn test` — run Jest test suite
- `yarn test:watch` — Jest in watch mode
- Single test file: `yarn jest path/to/file.test.ts`
- `yarn lint` — ESLint (`.ts`, `.tsx`, `.js`)
- `yarn format` — ESLint with `--fix`
- `yarn generate` — regenerate GraphQL types from the local Gatsby GraphQL schema (`localhost:8000/___graphql` must be running); config in `codegen.yml`, output to `src/generated/graphql.tsx`
- `yarn storybook` — Storybook dev server on port 9009 (serves from `public`, so run `yarn build` first)
- `yarn deploy` — build with path prefix and publish `public/` to the `gh-pages` branch (see `ghpages.sh` / `ghpages.publish.sh`, which use a `git worktree` at `web/public`)

A pre-commit hook (Husky) runs `format` and `lint`.

Required env (`web/.env.template`): `SITE_PREFIX`, `SITE_URL`, `ADMIN_URL`, `ADMIN_PROTOCOL`.

### admin/ (WordPress backend)

Run from `admin/`:

- `npm install && composer install` — install JS/PHP deps
- `npm run build` — runs `build.sh`: copies `theme/` and plugins into `dist/`, renaming the theme dir to `zskostelec`
- `npm run wp-up` / `npm run wp-down` / `npm run wp-reset` — manage the Docker Compose WordPress+MySQL stack (WP served at localhost:8001)
- `npm run wp-delete` — tears down containers **and volumes** (destroys the local DB)
- `npm run dev` — `wp-up` + `watch` (rebuilds theme/plugins on change via `npm-watch`, patterns in `package.json`)

Required env (`admin/.env.template`): `DB_ROOT_PASSWORD`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `ACF_PRO_KEY`.

## Architecture (web/)

### Build-time content pipeline

Gatsby config lives in `web/.gatsby/` (not the repo root) via `gatsby-plugin-ts-config`, so `gatsby-config.ts`, `gatsby-node.ts`, `gatsby-browser.tsx`, `gatsby-ssr.tsx` are all under `.gatsby/`.

1. `gatsby-source-wordpress` fetches all content types from the WP REST API (posts, pages, categories, and custom types: `wp_gallery`, `wp_employee`, `wp_gutak`, `wp_document`) into Gatsby's GraphQL data layer.
2. Raw entities pass through a **normalizer pipeline** (`composeNormalizers` in `src/utils/normalizer.ts`), configured in `.gatsby/gatsby-config.ts`. Each normalizer only touches entities matching a specific `__type`:
   - `block/normalizer.ts` — parses Gutenberg block JSON on posts/pages into a flat `blocks[]` array (`transformBlocks`), then runs per-block-type normalizers (`normalizeByType` in `block/normalizer.ts`) and rewrites internal links (admin URL → site-relative).
   - `nav/normalizer.ts`, `gallery/normalizer.ts`, `home/normalizer.ts`, `article/normalizer.ts` — shape data for those specific features.
   - `getAcfImageNormalizer(type, field)` — converts an ACF image field into a Gatsby image node reference (`<field>___NODE`).
3. `createSchemaCustomization` in `.gatsby/gatsby-node.ts` declares extra GraphQL types Gatsby can't infer (ACF field shapes, block parent IDs, category parent references).
4. `createPages` in `.gatsby/gatsby-node.ts` queries the sourced data (queries live in `.gatsby/gql/*.query.ts`) and programmatically creates every route:
   - one page per WP post → `templates/post.tsx`
   - one page per WP page, templated by its **WordPress template file** (`page-home.php`, `page-galleries.php`, `page-documents.php`, `page-gutak.php`, `page-employees.php` → matching `templates/*.tsx`, default fallback → `templates/page.tsx`)
   - one page per category, paginated (15 posts/page) → `templates/category.tsx`
   - one page per gallery → `templates/gallery.tsx`
   - the home template additionally resolves a "main post" and per-category article preview lists from ACF fields on the home page

Because page creation depends on which `.php` template a WP page uses, adding a new WP page template requires adding both the PHP template in `admin/theme/` and a matching entry in `templateByType` in `.gatsby/gatsby-node.ts`.

### Gutenberg block rendering

Post/page body content arrives as Gutenberg blocks. `components/block/constants.ts` (`BlockType`) enumerates supported block names; `components/block/register.ts` maps each `BlockType` to a React component under `components/block/core/<name>/`; `components/block/content.tsx` / `list.tsx` walk the normalized `blocks[]` tree and render via that map. Each block folder typically has a component (`<name>.tsx`) and, if it needs data reshaping beyond the generic pipeline, a `<name>.normalize.ts` (+ test).

### Component layering

- `src/components/ui/` — presentational, styled-components-based primitives (button, box, grid, nav, section, icon, etc.), not aware of WordPress/GraphQL data shapes.
- `src/components/<feature>/` (article, gallery, employee, nav, filter, block, etc.) — data-aware components/normalizers that adapt sourced WP data into props for the `ui/` primitives.
- `src/templates/` — Gatsby page templates, one per route type described above.
- `src/theme/` — styled-components theme (colors, spacing) and global styles.

### Custom types

Shared branded/utility types (`ID`, `Json`, `RawHTML`, `Nullable<T>`, etc.) are in `src/types.d.ts`; GraphQL-generated types go to `src/generated/graphql.tsx` (via `yarn generate`, not committed-by-hand).

## Architecture (admin/)

Plain WordPress theme (no page-facing templates — it's API-only) under `admin/theme/`:

- `functions.php` — theme bootstrap, includes everything under `inc/`.
- `inc/acf.php` — Advanced Custom Fields setup/exposure over REST (`airesvsg/acf-to-rest-api`).
- `inc/blocks.php` — Gutenberg block registration/config.
- `inc/page-types.php` — loads ACF field group JSON definitions (`inc/page-types/*.json`) for each custom "page type" (gallery, document, employee, gutak, homepage, building, article) and registers the corresponding CPTs/behavior (`inc/page-types/*.php`).
- `inc/menu.php`, `inc/urls.php`, `inc/editor.php`, `inc/articles.php` — nav menu REST exposure, URL/permalink handling, editor tweaks, article/post behavior.
- `page-*.php` at the theme root (`page-home.php`, `page-galleries.php`, `page-documents.php`, `page-gutak.php`, `page-employees.php`) — WP page templates selectable in the admin UI; their filenames are what `web/.gatsby/gatsby-node.ts` matches on to pick a Gatsby template.

ACF Pro is pulled as a Composer package requiring `ACF_PRO_KEY` (see `composer.json`'s custom `repositories` entry).
