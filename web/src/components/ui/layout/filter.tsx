import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiLayoutFilter = styled.div`
  display: flex;
`

const Filter = styled.div`
  min-width: 25rem;
  width: 25rem;
`

const Content = styled.div`
  flex-grow: 1;
  max-width: calc(100% - 25rem);
  padding-left: ${(p) => p.theme.spacing(4)};
`

export default createUiComponent(UiLayoutFilter, {
  Filter,
  Content
})
