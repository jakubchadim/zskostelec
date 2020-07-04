import React from 'react'
import { GlobalStyle } from '../src/theme/theme'

const GlobalStyleDecorator = (storyFn) => (
  <>
    <GlobalStyle />
    {storyFn()}
  </>
)

export default GlobalStyleDecorator
