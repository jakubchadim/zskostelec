import styled from 'styled-components'
import { createUiComponent } from '../utils'

function getItemWidth(num?: number, init?: string): string | undefined {
  return num == null ? init : `${(num * 100) / 12}%`
}

type ItemProps = {
  size?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
}

const Item = styled.div<ItemProps>`
  width: ${(p) => getItemWidth(p.size, '100%')};

  ${(p) => p.theme.media.xs.up} {
    width: ${(p) => getItemWidth(p.xs)};
  }

  ${(p) => p.theme.media.sm.up} {
    width: ${(p) => getItemWidth(p.sm)};
  }

  ${(p) => p.theme.media.md.up} {
    width: ${(p) => getItemWidth(p.md)};
  }

  ${(p) => p.theme.media.lg.up} {
    width: ${(p) => getItemWidth(p.lg)};
  }
`

const UiGrid = styled.div<{ largeGutter?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  margin: ${(p) =>
    p.largeGutter ? p.theme.spacing(-8, -4, 0) : p.theme.spacing(-4, -2, 0)};

  & > ${Item} {
    padding: ${(p) =>
      p.largeGutter ? p.theme.spacing(8, 4, 0) : p.theme.spacing(4, 2, 0)};
  }
`

export default createUiComponent(UiGrid, {
  Item
})
