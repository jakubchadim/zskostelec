import React from 'react'
import styled from 'styled-components'
import UiBox from '../ui/box/box'

const UiFilter = styled(UiBox)`
  position: sticky;
  top: 10rem;
`

type FilterProps = {
  title?: string
  children: React.ReactNode
}

const Filter: React.FC<FilterProps> = ({ title, children }) => {
  return (
    <UiFilter>
      {title && (
        <UiBox.Header>
          <h3>{title}</h3>
        </UiBox.Header>
      )}
      <UiBox.Content>{children}</UiBox.Content>
    </UiFilter>
  )
}

export default Filter
