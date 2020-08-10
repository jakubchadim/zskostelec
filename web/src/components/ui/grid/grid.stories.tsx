import { number, boolean } from '@storybook/addon-knobs'
import React from 'react'
import styled from 'styled-components'
import UiGrid from './grid'

const Content = styled.div<{ custom?: boolean }>`
  height: 10rem;
  background: ${(p) =>
    p.custom ? p.theme.color.primary1 : p.theme.color.gray5};
`

export default {
  title: 'Ui'
}

const options = {
  min: 0,
  max: 12,
  step: 1
}

function getSizeSelect(breakpoint: string): number {
  return number(`Breakpoint ${breakpoint}`, 6, options)
}

export const Grid = () => (
  <UiGrid largeGutter={boolean('Large gutter', false)}>
    <UiGrid.Item xs={6} sm={4} md={3} lg={2}>
      <Content />
    </UiGrid.Item>
    <UiGrid.Item xs={6} sm={4} md={3} lg={2}>
      <Content />
    </UiGrid.Item>
    <UiGrid.Item
      xs={getSizeSelect('xs')}
      sm={getSizeSelect('sm')}
      md={getSizeSelect('md')}
      lg={getSizeSelect('lg')}
    >
      <Content custom />
    </UiGrid.Item>
  </UiGrid>
)
