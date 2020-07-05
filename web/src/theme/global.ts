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
      color: ${(p) => p.theme.color.primary1};
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 ${(p) => p.theme.spacing(1)};
    font-weight: 400;
    line-height: 1.1;
  }
  
  h1 {
    font-size: 3.7rem;
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
`
