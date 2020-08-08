'use strict'

import { getBreakpoint, getSpacingGetter } from './utils'

export const theme = {
  media: {
    xs: getBreakpoint(416, 667),
    sm: getBreakpoint(668, 991),
    md: getBreakpoint(992, 1311),
    lg: getBreakpoint(1311, 1599)
  },
  color: {
    primary1: '#FFC107',
    primary2: '#FFC107',
    secondary1: '#009688',
    secondary2: '#009688',
    success1: '#4caf50',
    warning1: '#ff9800',
    danger1: '#f44336',
    black1: '#191919',
    black2: '#111',
    white1: '#fff',
    gray1: '#f9fbfd',
    gray2: '#f1f4f8',
    gray3: '#d9e2ef',
    gray4: '#c6d3e6',
    gray5: '#abbcd5',
    gray6: '#869ab8',
    gray7: '#506690',
    gray8: '#384c74',
    gray9: '#1b2a4e'
  },
  radius: {
    large: '0.8rem',
    medium: '0.5rem',
    small: '0.3rem'
  },
  font: {
    primary: "'Roboto', sans-serif",
    secondary: "'Roboto', sans-serif"
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
  spacing: getSpacingGetter(0.5),
  shadow: {
    small: '0 .125rem .25rem rgba(22,28,45,.075)',
    medium: '0 .5rem 1.5rem rgba(22,28,45,.1)',
    large: '0 1.5rem 4rem rgba(22,28,45,.1)',
    light: {
      medium: '0 .5rem 1.5rem rgba(22,28,45,.05)',
      large: '0 1.5rem 4rem rgba(22,28,45,.05)'
    },
    dark: {
      medium: '0 .5rem 1.5rem rgba(22,28,45,.15)',
      large: '0 1.5rem 4rem rgba(22,28,45,.15)'
    },
    lift:
      '0 1rem 2.5rem rgba(22,28,45,.1),0 .5rem 1rem -.75rem rgba(22,28,45,.1)'
  }
}

export type Theme = typeof theme
