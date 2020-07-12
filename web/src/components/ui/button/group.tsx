import styled from 'styled-components'
import { createUiComponent } from '../utils'
import UiButton from './button'

export enum UiButtonGroupAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

type UiButtonGroupProps = {
  align?: UiButtonGroupAlign
}

const UiButtonGroup = styled.div<UiButtonGroupProps>`
  text-align: ${(p) => p.align || 'initial'};
  margin: ${(p) => p.theme.spacing(-1)};

  & > ${UiButton} {
    margin: ${(p) => p.theme.spacing(1)};
  }
`

export default createUiComponent(UiButtonGroup, {})
