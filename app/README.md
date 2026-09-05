This is the Next.js rewrite of the ZŠ Kostelec nad Orlicí site, bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). See `/MIGRATION_PLAN.md` at the repo root for the overall rewrite plan and task breakdown.

## Design tokens

`src/app/globals.css` defines the Tailwind v4 `@theme` tokens ported from the legacy Gatsby site's styled-components theme (`web/src/theme/`). One thing to know before writing Tailwind classes in this app:

**The spacing unit is 5px, not Tailwind's default 4px.** `--spacing` is overridden to `0.3125rem` (5px) so the numbered spacing scale (`p-4`, `gap-2`, `w-8`, `-mt-4`, ...) matches the legacy `theme.spacing(n)` function exactly (`n * 5px`). If you're used to Tailwind's stock scale, `p-4` here is 20px, not 16px — check `globals.css` before assuming a value.

Colors, radii, font sizes, shadows, and breakpoints are also custom tokens (`primary-1`, `gray-1`..`gray-9`, `radius-small`/`medium`/`large`, `text-1`..`text-5`/`text-title-1`..`text-title-5`, `shadow-medium`/`lift`/etc., `xs`/`sm`/`md`/`lg` breakpoints) — see the comments at the top of `globals.css` for the full mapping and why the legacy site's `html { font-size: 10px }` convention was deliberately not carried forward.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Routing is a single optional catch-all (`src/app/[[...slug]]/page.tsx`) that resolves the URL against WP content and dispatches to a template in `src/components/templates/registry.tsx`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load Roboto (the legacy site's font, via `gatsby-plugin-google-fonts`), self-hosted at build time.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
