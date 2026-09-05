import { BlockColor } from './color'

/**
 * Maps a `BlockColor` to a Tailwind background-color utility class, matching
 * the `bg-*` token classes already used across the app (see `app/src/app/globals.css`'s
 * `--color-*` tokens). Ported from `web/src/components/block/color/utils.ts`'s
 * `getColorFromPalette`, split into background/text variants returning class
 * names instead of theme-object color values - this app applies colors via
 * Tailwind utility classes, not inline styles, elsewhere in the codebase.
 *
 * Every branch returns a literal string (not a template-interpolated one) so
 * Tailwind's static scanner can find and generate each class - see the T3
 * plan / final report for why that matters for the `dark` (hover) variants.
 * `dark` selects the "hover" pairing the legacy theme used for button/shape
 * hover states.
 */
export function getBackgroundColorClass(color: BlockColor | undefined, dark?: boolean): string {
  switch (color) {
    case BlockColor.PRIMARY:
      return dark ? 'bg-primary-2' : 'bg-primary-1'
    case BlockColor.SECONDARY:
      return dark ? 'bg-secondary-2' : 'bg-secondary-1'
    case BlockColor.WHITE:
      return dark ? 'bg-gray-1' : 'bg-white-1'
    case BlockColor.LIGHT_GRAY:
      return dark ? 'bg-gray-2' : 'bg-gray-1'
    case BlockColor.MEDIUM_GRAY:
      return dark ? 'bg-gray-4' : 'bg-gray-3'
    case BlockColor.DARK_GRAY:
      return dark ? 'bg-gray-6' : 'bg-gray-5'
    case BlockColor.BLACK:
      return dark ? 'bg-black-2' : 'bg-black-1'
    default:
      return ''
  }
}

/** Same mapping as `getBackgroundColorClass`, for `text-*` (used for both actual text color and the `currentColor`-based decorative wave divider). */
export function getTextColorClass(color: BlockColor | undefined, dark?: boolean): string {
  switch (color) {
    case BlockColor.PRIMARY:
      return dark ? 'text-primary-2' : 'text-primary-1'
    case BlockColor.SECONDARY:
      return dark ? 'text-secondary-2' : 'text-secondary-1'
    case BlockColor.WHITE:
      return dark ? 'text-gray-1' : 'text-white-1'
    case BlockColor.LIGHT_GRAY:
      return dark ? 'text-gray-2' : 'text-gray-1'
    case BlockColor.MEDIUM_GRAY:
      return dark ? 'text-gray-4' : 'text-gray-3'
    case BlockColor.DARK_GRAY:
      return dark ? 'text-gray-6' : 'text-gray-5'
    case BlockColor.BLACK:
      return dark ? 'text-black-2' : 'text-black-1'
    default:
      return ''
  }
}

/** Literal `hover:bg-*` class for a color's "dark" background variant - see the file doc comment on why this needs its own literal-returning function rather than string-concatenating `getBackgroundColorClass`'s result. */
export function getBackgroundHoverColorClass(color: BlockColor | undefined): string {
  switch (color) {
    case BlockColor.PRIMARY:
      return 'hover:bg-primary-2'
    case BlockColor.SECONDARY:
      return 'hover:bg-secondary-2'
    case BlockColor.WHITE:
      return 'hover:bg-gray-1'
    case BlockColor.LIGHT_GRAY:
      return 'hover:bg-gray-2'
    case BlockColor.MEDIUM_GRAY:
      return 'hover:bg-gray-4'
    case BlockColor.DARK_GRAY:
      return 'hover:bg-gray-6'
    case BlockColor.BLACK:
      return 'hover:bg-black-2'
    default:
      return ''
  }
}
