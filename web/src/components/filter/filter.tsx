import React from 'react'
import styled, { css } from 'styled-components'
import { BlockColor } from '../block/color/color'
import UiBox from '../ui/box/box'
import UiButton from '../ui/button/button'

const UiFilter = styled(UiBox)`
  position: sticky;
  top: 10rem;
  max-height: calc(100vh - 12rem);
  overflow: auto;
`

const Toggle = styled(UiButton)`
  width: 100%;

  ${(p) => p.theme.media.md.up} {
    display: none;
  }
`

const Content__open = css`
  max-height: 1000px;
`

const Content = styled.div<{ isOpen?: boolean }>`
  max-height: 0;
  transition: max-height 0.3s ease-in-out;

  ${(p) => p.isOpen && Content__open};

  ${(p) => p.theme.media.md.up} {
    max-height: inherit;
  }
`

type FilterProps = {
  title?: string
  children: React.ReactNode
}

const Filter: React.FC<FilterProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <UiFilter>
      <Toggle
        backgroundColor={BlockColor.SECONDARY}
        textColor={BlockColor.WHITE}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Skrýt filtr' : 'Zobrazit filtr'}
      </Toggle>
      <Content isOpen={isOpen}>
        {title && (
          <UiBox.Header>
            <h3>{title}</h3>
          </UiBox.Header>
        )}
        <UiBox.Content>{children}</UiBox.Content>
      </Content>
    </UiFilter>
  )
}

export default Filter
