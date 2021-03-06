import React from 'react'
import styled from 'styled-components'
import { toggleItemInArray } from '../../utils/array'
import UiInputCheckbox from '../ui/input/checkbox'

const ShowMore = styled.b`
  cursor: pointer;
  opacity: 0.5;
`

type EntityWithId = {
  id: string | number
}

type FilterChooserProps<T extends EntityWithId> = {
  items: T[]
  value?: T['id'][]
  onChange?: (items: T['id'][]) => void
  renderLabel: (item: T) => React.ReactNode
  limit?: number
}

function FilterChooser<TItem extends EntityWithId>({
  items,
  value,
  onChange,
  renderLabel,
  limit
}: FilterChooserProps<TItem>) {
  const [showAll, setShowAll] = React.useState(false)

  const handleClick = (id: TItem['id']) => {
    onChange?.(toggleItemInArray(value || [], id))
  }

  const hasLimit = limit != null && limit > 0
  const hasShowMore = hasLimit && limit != null && items.length > limit

  const filteredItems = hasShowMore
    ? items.slice(0, showAll ? items.length : limit)
    : items

  return (
    <div>
      {filteredItems.map((item) => (
        <UiInputCheckbox
          key={item.id}
          onClick={() => handleClick(item.id)}
          checked={value?.includes(item.id)}
          label={renderLabel(item)}
          fill
        />
      ))}
      {hasShowMore && (
        <ShowMore onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Skrýt' : 'Zobrazit vše'}
        </ShowMore>
      )}
    </div>
  )
}

export default FilterChooser
