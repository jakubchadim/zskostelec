import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../src/theme/theme'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    {element}
  </ThemeProvider>
)
