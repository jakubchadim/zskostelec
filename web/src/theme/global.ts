'use strict'

import { createGlobalStyle } from 'styled-components'

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
      color: ${(p) => p.theme.color.primary1}
    }
  }
`
