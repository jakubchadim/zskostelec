'use strict'

import { StyledIcon } from '@styled-icons/styled-icon'
import React from 'react'
import styled from 'styled-components'

type IconProps = {
  icon: StyledIcon
  className?: string
  size?: number | string
}

const Icon: React.FC<IconProps> = ({ icon: Icon, className }) => (
  <span className={className}>
    <Icon />
  </span>
)

const UiIcon = styled(Icon)`
  display: inline-flex;
  line-height: 1;
  vertical-align: middle;

  svg {
    height: ${(p) =>
      typeof p.size === 'number' ? `${p.size / 10}rem` : p.size || '1.2em'};
    vertical-align: middle;
  }
`

export default UiIcon
