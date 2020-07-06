import { Theme } from '../../../theme/theme'
import { BlockColor } from './color'

export function getColorFromPalette(
  color: BlockColor | undefined,
  theme: Theme
): string {
  switch (color) {
    case BlockColor.PRIMARY:
      return theme.color.primary1
    case BlockColor.SECONDARY:
      return theme.color.secondary1
    case BlockColor.WHITE:
      return theme.color.white1
    case BlockColor.LIGHT_GRAY:
      return theme.color.gray1
    case BlockColor.MEDIUM_GRAY:
      return theme.color.gray3
    case BlockColor.DARK_GRAY:
      return theme.color.gray5
    case BlockColor.BLACK:
      return theme.color.black1
  }

  return 'initial'
}
