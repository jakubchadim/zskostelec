import React from 'react'
import styled from 'styled-components'
import UiInputCheckbox from './checkbox'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Ui/Input'
}

export const Checkbox = () => (
  <Offset>
    <UiInputCheckbox />
    <UiInputCheckbox label='Bar' fill />
    <UiInputCheckbox label='Fooo' />
  </Offset>
)
