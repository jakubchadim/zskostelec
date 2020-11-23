import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiNonIdealState = styled.div`
  text-align: center;
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
