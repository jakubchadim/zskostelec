'use strict'

import { createGlobalStyle } from 'styled-components'
import { BlockColor } from '../components/block/color/color'
import { getColorFromPalette } from '../components/block/color/utils'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    height: 100%;
    color: ${(p) => p.theme.color.black1};
    background: ${(p) => p.theme.color.gray1};
    font-family: ${(p) => p.theme.font.primary};
    scroll-behavior: smooth;
  }

  html {
    font-size: 10px;
  }

  body {
    font-size: ${(p) => p.theme.fontSize.text4};
    line-height: 1.4;
  }
  
  a {
    color: inherit;
    
    &:hover {
      color: ${(p) => p.theme.color.primary1};
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: ${(p) => p.theme.spacing(1, 0, 2)};
    font-weight: 300;
    line-height: 1.1;
    font-family: ${(p) => p.theme.font.secondary};
  }
  
  h1 {
    font-size: 3.7rem;
    margin: ${(p) => p.theme.spacing(1, 0, 4)};
  }
  
  h2 {
    font-size: 3.1rem
  }

  h3 {
    font-size: 2.1rem
  }

  h4 {
    font-size: 1.9rem
  }

  h5 {
    font-size: 1.7rem
  }

  h6 {
    font-size: 1.2rem
  }
  
  .has-inline-color {
    &.has-primary-color {
      color: ${(p) => getColorFromPalette(BlockColor.PRIMARY, p.theme)};
    }
    &.has-secondary-color {
      color: ${(p) => getColorFromPalette(BlockColor.SECONDARY, p.theme)};
    }
    &.has-white-color {
      color: ${(p) => getColorFromPalette(BlockColor.WHITE, p.theme)};
    }
    &.has-black-color {
      color: ${(p) => getColorFromPalette(BlockColor.BLACK, p.theme)};
    }
    &.has-dark-gray-color {
      color: ${(p) => getColorFromPalette(BlockColor.DARK_GRAY, p.theme)};
    }
    &.has-medium-gray-color {
      color: ${(p) => getColorFromPalette(BlockColor.MEDIUM_GRAY, p.theme)};
    }
    &.has-light-gray-color {
      color: ${(p) => getColorFromPalette(BlockColor.LIGHT_GRAY, p.theme)};
    }
  }
`
