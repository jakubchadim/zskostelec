export enum BlockColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  WHITE = 'white',
  LIGHT_GRAY = 'light-gray',
  MEDIUM_GRAY = 'medium-gray',
  DARK_GRAY = 'dark-gray',
  BLACK = 'black'
}

export type BlockColorPalette = {
  backgroundColor?: BlockColor
  textColor?: BlockColor
}
