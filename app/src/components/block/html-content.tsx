import type { Nullable, RawHTML } from '@/lib/wp'

type ContentProps = {
  content?: Nullable<RawHTML>
}

/**
 * Renders a block's already-normalized inner HTML string. Replaces legacy's
 * `html-react-parser`-based `Content`, which additionally rewrote every
 * internal `<a>` into a Gatsby `Link` and every `<img>` into a data-aware
 * image component. We deliberately don't reproduce that anchor/image
 * interception here: T1's data layer already relative-izes internal hrefs
 * (`rewriteAdminUrls`/`rewriteBlockLinks`), so a plain `<a href="/relative">`
 * still navigates correctly — it just does a full page load instead of a
 * client-side transition. That's an accepted simplification for in-prose
 * links (approved by orchestrator); the one place internal navigation
 * benefits from `next/link` (the button block, a real component rather than
 * raw HTML) still uses it - see `core/button/button.tsx`.
 *
 * `display: contents` keeps this wrapper out of the render tree (no extra
 * box), matching the original `Content`'s bare-fragment behavior while still
 * giving `dangerouslySetInnerHTML` a single element to attach to.
 */
export function Content({ content }: ContentProps) {
  if (!content) {
    return null
  }

  return <div className="contents" dangerouslySetInnerHTML={{ __html: content }} />
}
