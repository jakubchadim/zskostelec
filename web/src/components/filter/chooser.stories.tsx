import React from 'react'
import styled from 'styled-components'
import FilterChooser from './chooser'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Filter'
}

const items = [
  {
    id: 1,
    name: 'First'
  },
  {
    id: 2,
    name: 'Second'
  },
  {
    id: 3,
    name: 'Third'
  }
]

const moreItems = [
  ...items,
  {
    id: 4,
    name: 'Fourth'
  },
  {
    id: 5,
    name: 'Fifth'
  },
  {
    id: 6,
    name: 'Sixth'
  }
]

export const Chooser = () => {
  const [value, setValue] = React.useState<number[]>()
  const [value2, setValue2] = React.useState<number[]>([2])

  return (
    <Offset>
      <h3>Simple</h3>
      <FilterChooser
        items={items}
        value={value}
        onChange={setValue}
        renderLabel={(item) => item.name}
      />
      <h3>Multi</h3>
      <FilterChooser
        items={moreItems}
        value={value2}
        onChange={setValue2}
        renderLabel={(item) => item.name}
      />
    </Offset>
  )
}
