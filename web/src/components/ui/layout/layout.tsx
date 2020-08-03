import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiLayout = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`

const Content = styled.div`
  flex-grow: 1;
`

export default createUiComponent(UiLayout, {
  Content
})
