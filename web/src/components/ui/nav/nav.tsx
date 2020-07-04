import React from 'react'
import styled from 'styled-components'

const UiNav = styled.nav`
  border-bottom: 0.1rem solid ${(p) => p.theme.color.gray2};
  background: ${(p) => p.theme.color.white1};
`

export const UiNavContainer = styled.div`
  height: 8rem;
  display: flex;
  vertical-align: middle;
`

export default UiNav
