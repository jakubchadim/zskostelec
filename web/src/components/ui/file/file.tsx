import styled from 'styled-components'
import { createUiComponent, textOverflowMixin } from '../utils'

const UiFile = styled.div`
  display: flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing(2)};
`

const Icon = styled.div`
  width: 4.4rem;
  min-width: 4.4rem;
`

const Name = styled.div`
  flex-grow: 1;
  font-size: 1.1em;

  ${textOverflowMixin};
`

const Ext = styled.div`
  font-weight: 700;
  opacity: 0.5;
  width: 4.5rem;
  text-align: right;
  padding-left: ${(p) => p.theme.spacing(2)};
`

const Button = styled.div`
  padding-left: ${(p) => p.theme.spacing(2)};
`

export default createUiComponent(UiFile, {
  Icon,
  Name,
  Ext,
  Button
})
