import { Theme } from '../../../theme/theme'
import { BlockColor } from './color'

export function getColorFromPalette(
  color: BlockColor | undefined,
  theme: Theme,
  dark?: boolean,
  init = 'initial'
): string {
  const { color: c } = theme

  switch (color) {
    case BlockColor.PRIMARY:
      return dark ? c.primary2 : c.primary1
    case BlockColor.SECONDARY:
      return dark ? c.secondary2 : c.secondary1
    case BlockColor.WHITE:
      return dark ? c.gray1 : c.white1
    case BlockColor.LIGHT_GRAY:
      return dark ? c.gray2 : c.gray1
    case BlockColor.MEDIUM_GRAY:
      return dark ? c.gray4 : c.gray3
    case BlockColor.DARK_GRAY:
      return dark ? c.gray6 : c.gray5
    case BlockColor.BLACK:
      return dark ? c.black2 : c.black1
  }

  return init
}
