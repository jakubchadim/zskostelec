import React from 'react'
import styled from 'styled-components'
import Filter from './filter'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Filter'
}

export const Base = () => (
  <Offset>
    <Filter title='Filter'>
      <div>Input...</div>
    </Filter>
  </Offset>
)
