import React from 'react'
import styled from 'styled-components'
import { getColorFromPalette } from '../../block/color/utils'
import { BlockColorPalette } from '../../block/color/color'
import UiShape from '../shape/shape'
import { createUiComponent } from '../utils'

type SectionProps = {
  className?: string
  children: React.ReactNode
} & BlockColorPalette

const Section: React.FC<SectionProps> = ({
  className,
  children,
  backgroundColor
}) => (
  <>
    <UiShape color={backgroundColor} />
    <section className={className}>{children}</section>
  </>
)

const UiSection = styled(Section)`
  padding: ${(p) => p.theme.spacing(8, 0)};
  background: ${(p) => getColorFromPalette(p.backgroundColor, p.theme)};
  color: ${(p) => getColorFromPalette(p.textColor, p.theme)};

  ${(p) => p.theme.media.sm.up} {
    padding: ${(p) => p.theme.spacing(10, 0)};
  }

  ${(p) => p.theme.media.md.up} {
    padding: ${(p) => p.theme.spacing(12, 0)};
  }
`

const Pagination = styled.div`
  padding: ${(p) => p.theme.spacing(8, 0, 2)};

  ${(p) => p.theme.media.sm.up} {
    padding: ${(p) => p.theme.spacing(10, 0, 8)};
  }

  ${(p) => p.theme.media.md.up} {
    padding: ${(p) => p.theme.spacing(12, 0, 8)};
  }
`

export default createUiComponent(UiSection, { Pagination })
