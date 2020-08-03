import _flatten from 'lodash/flatten'
import { NormalizerFc } from '../../utils/normalizer'

type NavItem = {
  wordpress_children: NavItem[] | null
}

type InputEntity = {
  items: NavItem[]
  __type: string
}

function transformNavItems(items: NavItem[]): NavItem[] {
  return _flatten(
    items.map((item) => {
      if (item.wordpress_children?.length) {
        return transformNavItems([
          {
            ...item,
            wordpress_children: null
          },
          ...item.wordpress_children
        ])
      }

      return item
    })
  )
}

const normalizer: NormalizerFc<InputEntity> = ({ entities }) => {
  return entities.map((entity) => {
    if (entity.__type === 'wordpress__wp_api_menus_menus_items') {
      return {
        ...entity,
        items: transformNavItems(entity.items)
      }
    }

    return entity
  })
}

export default normalizer
