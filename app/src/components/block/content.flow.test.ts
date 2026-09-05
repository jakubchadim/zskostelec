import { describe, expect, it } from 'vitest'
import { normalizeBlocks, transformBlocks, type RawBlock } from '@/lib/wp'
import { registerCoreBlockNormalizers } from './register-normalizers'

/**
 * Verifies the two-pass flow documented in `content.tsx`'s doc comment:
 * the entity layer (`@/lib/wp`'s `normalizePost`/`normalizePage`) calls
 * `normalizeBlocks(transformed, search)` at fetch time, before this
 * module's per-type normalizers are ever registered - so that call only
 * does link rewriting. `BlockContent` then calls `normalizeBlocks(blocks)`
 * again (no `search`) after registering, which is where per-type
 * normalization (button href extraction here) actually happens.
 *
 * This end-to-end-simulates both halves of that claim in one flow: (1) an
 * absolute admin-origin href gets rewritten to relative on the first
 * (fetch-time, empty-registry) pass, while the button's wrapper markup is
 * left untouched since nothing is registered yet, and (2) the second
 * (registered, no-`search`) pass extracts the button correctly AND doesn't
 * re-rewrite (or otherwise disturb) the already-relative href - proving the
 * "no search arg" second call is safe to run unconditionally.
 */
describe('BlockContent normalizeBlocks re-run flow', () => {
  it('link-rewrites at fetch time, then per-type-normalizes at render time', () => {
    const search = { sourceUrl: 'https://admin.example.com', replacementUrl: '' }

    const raw: RawBlock[] = [
      {
        blockName: 'core/button',
        attrs: [],
        innerBlocks: [],
        innerHTML:
          '<div class="wp-block-button"><a class="wp-block-button__link" href="https://admin.example.com/contact/">Contact us</a></div>'
      }
    ]

    const transformed = transformBlocks(raw, null)

    // Fetch-time pass (entity layer): link rewriting only, registry is empty.
    const fetchTimePass = normalizeBlocks(transformed, search)
    expect(fetchTimePass[0].content).toContain('wp-block-button__link')
    expect(fetchTimePass[0].content).toContain('href="/contact/"')

    // Render-time pass (BlockContent): registry now populated, no `search`.
    registerCoreBlockNormalizers()
    const renderTimePass = normalizeBlocks(fetchTimePass)

    expect(renderTimePass[0].content).toBe('Contact us')
    const attrs = JSON.parse(renderTimePass[0].attrs)
    expect(attrs.href).toBe('/contact/')
  })
})
