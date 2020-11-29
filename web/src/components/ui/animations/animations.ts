'use strict'

import { css, keyframes } from 'styled-components'

const revealAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const revealMixin = css`
  animation: ${revealAnimation} 0.6s ease-in-out;
`
