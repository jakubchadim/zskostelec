import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme, GlobalStyle } from './src/theme/theme'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    {element}
  </ThemeProvider>
)
