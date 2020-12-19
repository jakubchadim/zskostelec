import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiLayoutFilter = styled.div`
  ${(p) => p.theme.media.md.up} {
    display: flex;
  }
`

const Filter = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(4)};

  ${(p) => p.theme.media.md.up} {
    min-width: 25rem;
    width: 25rem;
    margin-bottom: 0;
  }
`

const Content = styled.div`
  ${(p) => p.theme.media.md.up} {
    flex-grow: 1;
    max-width: calc(100% - 25rem);
    padding-left: ${(p) => p.theme.spacing(4)};
  }
`

export default createUiComponent(UiLayoutFilter, {
  Filter,
  Content
})
