import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiLinkBack = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(2)};
  font-size: 0.875em;

  ${(p) => p.theme.media.md.up} {
    margin-top: calc(-1em - ${(p) => p.theme.spacing(2)});
  }
`

export default createUiComponent(UiLinkBack, {})
