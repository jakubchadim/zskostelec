import styled, { css } from 'styled-components'
import { createUiComponent } from '../utils'

const UiLink__secondary = css`
  color: ${(p) => p.theme.color.secondary1};

  &:hover {
    color: ${(p) => p.theme.color.secondary2};
  }
`

const UiLink__simple = css`
  text-decoration: none;
`

const UiLink = styled.a<{ secondary?: boolean; simple?: boolean }>`
  &:hover {
    text-decoration: underline;
  }

  ${(p) => p.simple && UiLink__simple};
  ${(p) => p.secondary && UiLink__secondary};
`

const Icon = styled.span`
  height: 1.2em;
  vertical-align: middle;
  margin-right: ${(p) => p.theme.spacing(2)};
  margin-top: -0.1em;
`

export default createUiComponent(UiLink, {
  Icon
})
