import type { WpGallery } from '@/lib/wp'

/**
 * Parity with the legacy `allGalleryQuery`'s
 * `filter: { acf: { preview: { link: { ne: null } } } }` - a gallery only
 * gets an index card when it has a usable preview image. `getGalleries()`
 * already filters this same condition at the data-layer level (its own
 * `preview` is itself fallback-resolved: explicit preview, else the first
 * gallery image), so this is a defensive/explicit re-assertion of that same
 * intent directly at the render site, not a new behavior.
 */
export function hasPreview(gallery: WpGallery): boolean {
  return gallery.acf.preview != null
}
