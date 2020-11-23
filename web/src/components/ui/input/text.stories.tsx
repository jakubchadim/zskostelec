import React from 'react'
import styled from 'styled-components'
import UiInputText from './text'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Ui/Input'
}

export const Text = () => (
  <Offset>
    <UiInputText
      placeholder='Text'
    />
  </Offset>
)
