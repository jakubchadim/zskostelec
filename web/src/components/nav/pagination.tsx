import { KeyboardArrowLeft } from '@styled-icons/material/KeyboardArrowLeft'
import { KeyboardArrowRight } from '@styled-icons/material/KeyboardArrowRight'
import { StyledIcon } from '@styled-icons/styled-icon'
import { Link } from '@reach/router'
import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../block/color/color'
import UiButton from '../ui/button/button'
import UiButtonGroup, { UiButtonGroupAlign } from '../ui/button/group'
import UiIcon from '../ui/icon/icon'

function getPageNumbers(total: number, current: number): number[] {
  const firstItem = Math.max(1, Math.min(total - 4, current - 2))
  const maxNumbers = Math.min(total, 5)
  const numbers = []

  for (let i = 0; i < maxNumbers; i++) {
    numbers.push(firstItem + i)
  }

  return numbers
}

const getArrowButton = (to: string, icon: StyledIcon, disabled: boolean) => {
  if (disabled) {
    return (
      <UiButton
        minWidth={3}
        backgroundColor={BlockColor.DARK_GRAY}
        textColor={BlockColor.WHITE}
        disabled
      >
        <UiPaginationIcon icon={icon} />
      </UiButton>
    )
  }

  return (
    <UiButton
      as={Link}
      to={to}
      minWidth={3}
      backgroundColor={BlockColor.DARK_GRAY}
      textColor={BlockColor.WHITE}
    >
      <UiPaginationIcon icon={icon} />
    </UiButton>
  )
}

const UiPaginationIcon = styled(UiIcon)`
  font-size: 1.8em;
  margin-top: -0.55em;
  margin-bottom: -0.5em;
`

type NavPaginationProps = {
  totalCount: number
  current: number
  generateLink: (page: number) => string
}

const NavPagination: React.FC<NavPaginationProps> = ({
  totalCount,
  current,
  generateLink
}) => {
  const pages = getPageNumbers(totalCount, current)

  return (
    <UiButtonGroup align={UiButtonGroupAlign.CENTER}>
      {getArrowButton(
        generateLink(Math.max(1, current - 1)),
        KeyboardArrowLeft,
        current === 1
      )}
      {pages.map((page) => (
        <UiButton
          key={page}
          as={Link}
          to={generateLink(page)}
          minWidth={3}
          backgroundColor={
            page === current ? BlockColor.SECONDARY : BlockColor.DARK_GRAY
          }
          textColor={BlockColor.WHITE}
        >
          {page}
        </UiButton>
      ))}
      {getArrowButton(
        generateLink(Math.min(totalCount, current + 1)),
        KeyboardArrowRight,
        current === totalCount
      )}
    </UiButtonGroup>
  )
}

export default NavPagination
