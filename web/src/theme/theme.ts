'use strict'

import { createGlobalStyle } from 'styled-components'
import { getBreakpoint, getSpacingGetter } from './utils'

export const theme = {
  media: {
    xs: getBreakpoint(416, 667),
    sm: getBreakpoint(668, 991),
    md: getBreakpoint(992, 1311),
    lg: getBreakpoint(1311, 1599)
  },
  color: {
    primary1: '#FC2A63',
    primary2: '#c02c62',
    secondary1: '#FD725A',
    success1: '#4caf50',
    warning1: '#ff9800',
    danger1: '#f44336',
    black1: '#191919',
    white1: '#fff',
    gray1: '#2b3140'
  },
  radius: {
    large: '0.8rem',
    medium: '0.5rem',
    small: '0.3rem'
  },
  font: {
    primary: '\'Roboto\', sans-serif'
  },
  fontSize: {
    text1: '1rem',
    text2: '1.2rem',
    text3: '1.5rem',
    text4: '1.6rem',
    text5: '1.8rem',
    title1: '4rem',
    title2: '3.2rem',
    title3: '3rem',
    title4: '2.4rem',
    title5: '2rem'
  },
  spacing: getSpacingGetter(0.5)
}

export type Theme = typeof theme

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    height: 100%;
    color: ${theme.color.black1};
    font-family: ${theme.font.primary};
    scroll-behavior: smooth;
  }

  html {
    font-size: 10px;
  }

  body {
    font-size: ${theme.fontSize.text4};
    line-height: 1.4;
  }
`
