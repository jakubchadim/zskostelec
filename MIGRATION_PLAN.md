# ZŠ Kostelec — Gatsby → Next.js rewrite plan (v2, REST-based)

## Architecture review & the GraphQL question

**Decision: skip WPGraphQL entirely. Use the WordPress REST API the site already exposes.**

The v1 plan proposed WPGraphQL + WPGraphQL-for-ACF + Smart Cache, which required bumping
ACF Pro to 6.x, exposing every CPT and ACF group to GraphQL, and writing a custom
`register_graphql_field()` for Gutenberg blocks. None of that is needed, because everything
the current site consumes is **already REST**, verified in the codebase (`gatsby-source-wordpress`
v3 in `web/package.json` sources exclusively from REST):

| Data | Endpoint (already live) | Provided by |
|---|---|---|
| Posts / pages / categories / media | `/wp-json/wp/v2/{posts,pages,categories,media}` | WP core |
| CPTs: gallery, employee, document, gutak | `/wp-json/wp/v2/{gallery,employee,document,gutak}` | `show_in_rest => true` in `admin/theme/inc/page-types/*.php` |
| ACF fields (`acf` key on every entity) | same endpoints | `acf-to-rest-api` plugin |
| Parsed Gutenberg blocks (`blocks` key) | posts + pages endpoints | custom `register_rest_field` in `admin/theme/inc/blocks.php` |
| Nav menus | `/wp-json/wp-api-menus/v2/menus` | `wp-api-menus` plugin |
| Page template dispatch | `template` field on pages | WP core |
| Pagination | `X-WP-Total` / `X-WP-TotalPages` headers, `page`/`per_page` params | WP core |

Consequences of skipping GraphQL:
- **Zero WP-side changes required for the rewrite** (only the small revalidation webhook, later).
- The WP/PHP/MySQL upgrade is **decoupled** — no longer a Phase 1 blocker (modern WPGraphQL
  needed PHP ≥8.1; REST works on the current stack). It stays in the plan as independent infra work.
- ACF Pro can stay at 5.7.7 for now.
- The "API bombardment" problem was a *Gatsby full-crawl* problem, not a REST problem. Next.js
  with ISR fetches only what a page needs, when it needs it. We additionally use `_fields=` to trim
  payloads and cache fetches with tags.

Everything else from v1 stands: Next.js (`/app`, already scaffolded: Next 16, React 19,
Tailwind 4) + Vercel, Cloudflare R2 for media (separate phase), `<WpImage>` serving WP's
existing size variants (no image transformation service), gallery pagination, lucide-react,
yet-another-react-lightbox, shadcn/ui + Radix for nav.

## Route parity (from `web/.gatsby/gatsby-node.ts`)

All routes come from WP `link` fields, so URL parity is automatic if we key routing on them:

- **Posts** → `post.link` (skip external `http…` links)
- **Pages** → `page.link`, template picked by `page.template`:
  `page-home.php` → home, `page-galleries.php` → galleries index, `page-documents.php` → documents,
  `page-gutak.php` → gutak, `page-employees.php` → employees, otherwise generic page
- **Categories** → `category.link` + paginated `…/strana-N/` (15 posts/page)
- **Galleries** → `gallery.link`
- **Home context**: ACF `mainPost` (int id), `mainCategory` + `additionalCategoryFirst/Second`
  → main post + per-category previews (6 for main cat minus main post, 3 for others; fallback:
  first article of main category becomes main post)

Next.js implementation: one optional catch-all route `app/src/app/[[...slug]]/page.tsx` that
resolves the slug path against WP content (page → post → category (+`strana-N`) → gallery) and
dispatches to the right template component. `generateStaticParams` prebuilds known routes;
`dynamicParams = true` + ISR covers new content without full rebuilds.

## Task breakdown

### Wave 1 — Foundation (parallel)
- **T1 — WP REST data layer** (`app/src/lib/wp/`): typed fetch client (env-driven base URL,
  `_fields` trimming, pagination helper, tagged `next: { revalidate, tags }` caching), TS types for
  all entities (post, page, category, media, menu, CPTs, ACF shapes, raw block), port of the block
  normalizer pipeline from `web/src/components/block/normalizer.ts` (`transformBlocks`, link
  rewriting admin-URL → relative, per-block-type normalizers) **with its tests** (add Vitest),
  and a `resolveRoute(slugPath)` content resolver. No React components.
- **T2 — Design system + app shell**: Tailwind v4 theme tokens ported from `web/src/theme/`
  (colors, fonts incl. Google Fonts, spacing scale, breakpoints), root layout, header + nav
  (shadcn/ui NavigationMenu/Sheet; menu data shape stubbed against T1's `WpMenu` type), footer,
  404 page, `<WpImage>` component (renders WP size variants — `medium_large` for thumbs,
  srcset from `media_details.sizes`), the catch-all route skeleton with a template-dispatch map.

### Wave 2 — Features (parallel, after Wave 1)
- **T3 — Gutenberg block renderer**: port `web/src/components/block/` (constants, register,
  content/list walkers, core blocks: paragraph, image, list, table, quote, button, file, group)
  to Tailwind/React, with normalize tests where they exist in `web`.
- **T4 — Posts + categories**: post template, category template with `strana-N` pagination
  (15/page, uses `X-WP-Total`), category tree/breadcrumbs, wiring into the dispatcher.
- **T5 — Galleries**: galleries index (preview grid) + gallery detail with **pagination** and
  yet-another-react-lightbox; handles null/empty galleries (see recent fixes in git history).
- **T6 — CPT pages**: employees, documents, gutak templates + generic page template.
- **T7 — Homepage**: main post + article previews (ACF-driven categories), porting
  `web/src/components/home/normalizer.ts` and `templates/home.tsx` logic.

### Wave 3 — Platform (after Wave 2)
- **T8 — SEO + routing polish**: metadata API parity with `web/src/components/seo`, sitemap,
  robots, redirects, proper 404/notFound handling in the resolver.
- **T9 — ISR + revalidation**: `app/api/revalidate` route (secret-protected, tag-based),
  WP-side `admin/theme/inc/revalidate.php` firing on save_post/edit for all types.

### Wave 4 — Infra (independent / ops-heavy, scheduled with user)
- **T10 — Media → Cloudflare R2** offload + 9GB backfill (fixes storage).
- **T11 — WP/PHP/MySQL Docker stack upgrade** (EOL fix; now decoupled from rewrite).
- **T12 — Vercel deploy + cutover**: envs, deploy, DNS, retire `web/`.

## Backlog / fast-follows (from Wave 1 reviews)

- `normalizeAcfImage` drops the raw ACF top-level `width`/`height`, so `buildSrcSet` never
  includes the true full-resolution variant for ACF-sourced images — carry them into
  `media_details.width/height`.
- ~~Header logo `<h1>`~~ — resolved in Wave 2: logo is a `<p>`, page templates carry the h1.
- ~~Header `transparent` wiring~~ — resolved in Wave 2 (T7): `usePathname() === '/'` default.
- Route classification proxies content-emptiness via `excerpt` (10-word cap) — misclassifies
  only a manually-excerpted content-less link article; verify against live data once WP is up.
- Live-host verification pass (blocks field anonymous access, wp-api-menus raw shape, ACF
  file-field shapes, permalink bases) — first thing once `zskostelec.tode.cz` responds.
- Unused create-next-app assets `app/public/{file,globe,next,vercel,window}.svg` — delete.
- `getPostsForCategory` runs the full block-normalization pipeline (JSDOM) for all 15 posts per
  category page, though listing cards need only preview fields — add a lean `getPostPreviews`
  fetch in lib/wp (T1 fast-follow).
- `buildLinkIndex` indexes pages before posts, so a content-less "link article" aliased to
  another entity's path can shadow it silently — tighten collision handling in resolve.ts.
- `block/core/table/table.normalize.ts` ports a legacy stripes-detection quirk verbatim
  (no-className tables default to stripes on) — decide fix-or-keep with the site owner.

## Orchestration protocol

Sonnet developer agents, one per task. Each dev: ① reads this plan + its task spec + the `web/`
sources to port, ② reports an implementation plan (files, contracts, approach) and stops,
③ receives review feedback from the orchestrator, ④ implements after approval, ⑤ gets its work
reviewed by a separate Sonnet reviewer agent; findings go back to the dev to fix.
Parallel tasks touch disjoint directories; the shared dispatcher map is edited one-line-per-task.
