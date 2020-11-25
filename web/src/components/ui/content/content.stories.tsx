import React from 'react'
import styled from 'styled-components'
import { boolean } from '@storybook/addon-knobs'
import UiContent from './content'

const PreviewBlock = styled.div`
  height: 200px;
  background: ${(p) => p.theme.color.gray4};
`

export default {
  title: 'Ui'
}

export const Content = () => (
  <div>
    <UiContent
      largeGutter={boolean('largeGutter', false)}
      smallGutter={boolean('smallGutter', false)}
    >
      <PreviewBlock />
    </UiContent>
    <UiContent>
      <PreviewBlock />
    </UiContent>
  </div>
)
