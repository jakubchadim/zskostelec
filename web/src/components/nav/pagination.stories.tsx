import React from 'react'
import styled from 'styled-components'
import { number } from '@storybook/addon-knobs'
import UiNavPagination from './pagination'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Nav'
}

export const Pagination = () => (
  <Offset>
    <UiNavPagination
      totalCount={number('totalCount', 10)}
      current={number('current', 5)}
      generateLink={(page) => `/page-${page}`}
    />
  </Offset>
)
