import styled, { css } from 'styled-components'
import { createUiComponent } from '../utils'

function getItemWidth(num?: number, init?: string): string | undefined {
  if (num === 0) {
    return '0'
  }

  return num == null ? init : `${(num * 100) / 12}%`
}

type ItemProps = {
  size?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
}

const Item__visible = css`
  display: block;
`

const Item__hidden = css`
  display: none;
`

const Item = styled.div<ItemProps>`
  width: ${(p) => getItemWidth(p.size, '100%')};
  ${(p) =>
    p.size === 0 ? Item__hidden : p.size != null ? Item__visible : undefined};

  ${(p) => p.theme.media.xs.up} {
    width: ${(p) => getItemWidth(p.xs)};
    ${(p) =>
      p.xs === 0 ? Item__hidden : p.xs != null ? Item__visible : undefined};
  }

  ${(p) => p.theme.media.sm.up} {
    width: ${(p) => getItemWidth(p.sm)};
    ${(p) =>
      p.sm === 0 ? Item__hidden : p.sm != null ? Item__visible : undefined};
  }

  ${(p) => p.theme.media.md.up} {
    width: ${(p) => getItemWidth(p.md)};
    ${(p) =>
      p.md === 0 ? Item__hidden : p.md != null ? Item__visible : undefined};
  }

  ${(p) => p.theme.media.lg.up} {
    width: ${(p) => getItemWidth(p.lg)};
    ${(p) =>
      p.lg === 0 ? Item__hidden : p.lg != null ? Item__visible : undefined};
  }
`

const UiGrid = styled.div<{ largeGutter?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  margin: ${(p) => p.theme.spacing(-4, -2, 0)};

  ${(p) => p.theme.media.md.up} {
    margin: ${(p) => (p.largeGutter ? p.theme.spacing(-8, -4, 0) : undefined)};
  }

  & > ${Item} {
    padding: ${(p) => p.theme.spacing(4, 2, 0)};

    ${(p) => p.theme.media.md.up} {
      padding: ${(p) => (p.largeGutter ? p.theme.spacing(8, 4, 0) : undefined)};
    }
  }
`

export default createUiComponent(UiGrid, {
  Item
})
