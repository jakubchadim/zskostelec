import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiInputText = styled.input`
  display: block;
  width: 100%;
  padding: ${(p) => p.theme.spacing(1, 3)};
  font-weight: 400;
  line-height: 1.6;
  color: ${(p) => p.theme.color.black1};
  font-size: ${(p) => p.theme.fontSize.text4};
  border: 1px solid ${(p) => p.theme.color.gray5};
  border-radius: ${(p) => p.theme.radius.small};
`

export default createUiComponent(UiInputText, {})
