import React from 'react'
import { select } from '@storybook/addon-knobs'
import UiButton from './button'
import UiButtonGroup, { UiButtonGroupAlign } from './group'

export default {
  title: 'Ui/Button/Group'
}

export const Default = () => (
  <UiButtonGroup align={select('Align', UiButtonGroupAlign, undefined)}>
    <UiButton>First button</UiButton>
    <UiButton>Second button</UiButton>
    <UiButton>Third button</UiButton>
  </UiButtonGroup>
)
