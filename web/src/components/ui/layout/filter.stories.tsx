import React from 'react'
import styled from 'styled-components'
import UiLayoutFilter from './filter'

export default {
  title: 'Ui/Layout'
}

const FilterContent = styled.div`
  padding: 2rem 1rem;
  background: ${(p) => p.theme.color.primary1};
`

const Content = styled.div`
  padding: 2rem 1rem;
`

export const Filter = () => (
  <UiLayoutFilter>
    <UiLayoutFilter.Filter>
      <FilterContent>Filter</FilterContent>
    </UiLayoutFilter.Filter>
    <UiLayoutFilter.Content>
      <Content>Content</Content>
    </UiLayoutFilter.Content>
  </UiLayoutFilter>
)
