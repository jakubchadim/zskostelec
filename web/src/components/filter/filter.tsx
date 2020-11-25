import React from 'react'
import UiBox from '../ui/box/box'

type FilterProps = {
  title?: string
  children: React.ReactNode
}

const Filter: React.FC<FilterProps> = ({ title, children }) => {
  return (
    <UiBox>
      {title && (
        <UiBox.Header>
          <h3>{title}</h3>
        </UiBox.Header>
      )}
      <UiBox.Content>{children}</UiBox.Content>
    </UiBox>
  )
}

export default Filter
