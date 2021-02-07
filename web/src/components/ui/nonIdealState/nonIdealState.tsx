import styled, { css } from 'styled-components'
import { createUiComponent } from '../utils'

const UiNonIdealState__offset = css`
  margin-top: 5rem;

  ${(p) => p.theme.media.sm.up} {
    margin-top: 7rem;
  }
`

const UiNonIdealState = styled.div<{ offsetTop?: boolean }>`
  text-align: center;
  ${(p) => p.offsetTop && UiNonIdealState__offset};
`

const Icon = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(4)};
`

const Description = styled.p`
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
`

export default createUiComponent(UiNonIdealState, {
  Icon,
  Description
})
