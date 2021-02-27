import styled, { css } from 'styled-components'
import { BlockColorPalette } from '../../block/color/color'
import { getColorFromPalette } from '../../block/color/utils'
import { revealMixin } from '../animations/animations'
import { createUiComponent } from '../utils'

type UiBoxProps = BlockColorPalette & {
  offsetTop?: boolean
  offsetBottom?: boolean
  revealAnimation?: boolean
  fullHeight?: boolean
}

const ScrollContainer = styled.div`
  max-height: 100%;
  overflow: auto;

  /* total width */
  &::-webkit-scrollbar {
    background-color: ${(p) => p.theme.color.white1};
    width: 10px;
    height: 10px;
  }

  /* background of the scrollbar except button or resizer */
  &::-webkit-scrollbar-track {
    background-color: ${(p) => p.theme.color.white1};
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.color.gray5};
    border-radius: 10px;
    border: 2px solid ${(p) => p.theme.color.white1};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${(p) => p.theme.color.gray5};
    border: 1px solid ${(p) => p.theme.color.white1};
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-corner {
    background: ${(p) => p.theme.color.gray6};
  }
`

const UiBox__fullHeight = css`
  height: 100%;
  position: relative;
  overflow: hidden;

  & > ${ScrollContainer} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`

const ScrollParalax = styled.span`
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 1rem;
    height: ${(p) => p.theme.spacing(5)};
    z-index: 5;
  }

  &:before {
    top: 0;
    background: linear-gradient(180deg, #fff 0, rgba(255, 255, 255, 0) 100%);
  }

  &:after {
    bottom: 0;
    background: linear-gradient(0deg, #fff 0, rgba(255, 255, 255, 0) 100%);
  }
`

const UiBox = styled.div<UiBoxProps>`
  background: ${(p) =>
    getColorFromPalette(
      p.backgroundColor,
      p.theme,
      false,
      p.theme.color.white1
    )};
  color: ${(p) =>
    getColorFromPalette(p.textColor, p.theme, false, p.theme.color.black1)};
  box-shadow: ${(p) => p.theme.shadow.lift};
  border-radius: ${(p) => p.theme.radius.medium};
  margin-top: ${(p) => (p.offsetTop ? p.theme.spacing(2) : undefined)};
  margin-bottom: ${(p) => (p.offsetBottom ? p.theme.spacing(2) : undefined)};
  ${(p) => p.revealAnimation && revealMixin};
  ${(p) => p.fullHeight && UiBox__fullHeight};
`

const Header = styled.div`
  padding: ${(p) => p.theme.spacing(3, 4, 0)};
  margin-bottom: ${(p) => p.theme.spacing(2)};

  ${(p) => p.theme.media.xs.up} {
    padding: ${(p) => p.theme.spacing(5, 6, 0)};
    margin-bottom: ${(p) => p.theme.spacing(4)};
  }
`

const Content = styled.div`
  padding: ${(p) => p.theme.spacing(3, 4)};

  ${(p) => p.theme.media.xs.up} {
    padding: ${(p) => p.theme.spacing(5, 6)};
  }

  ${Header} + & {
    padding-top: 0;

    ${(p) => p.theme.media.xs.up} {
      padding-top: 0;
    }
  }

  p:last-child {
    margin-bottom: 0;
  }
`

export default createUiComponent(UiBox, {
  Header,
  Content,
  ScrollContainer,
  ScrollParalax
})
