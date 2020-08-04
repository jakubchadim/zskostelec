import { number, select } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import * as Icons from '@styled-icons/material'
import UiIcon from './icon'

const ICON_NAMES: string[] = Object.keys(Icons)

const Colored = styled.span`
  padding-left: 3rem;
  color: ${(p) => p.theme.color.success1};
`

export default {
  title: 'Ui'
}

export const Icon = () => {
  const iconName = select('Icon', ICON_NAMES, ICON_NAMES[0])
  const icon = (Icons as any)[iconName]
  const size = number('Size', 50)

  return (
    <>
      <UiIcon icon={icon} size={size} />
      <Colored>
        <UiIcon icon={icon} size={size} />
      </Colored>
    </>
  )
}
