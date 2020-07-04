import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../src/theme/theme'
import { GlobalStyle } from '../src/theme/global'

const ThemeDecorator = (storyFn) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    {storyFn()}
  </ThemeProvider>
)

export default ThemeDecorator
