import styled, { css } from 'styled-components'
import { createUiComponent } from '../utils'

const UiNavBar__transpatent = css`
  background: transparent;
  box-shadow: none;
`

const UiNavBar = styled.nav<{ transparent?: boolean }>`
  background: ${(p) => p.theme.color.primary1};
  color: ${(p) => p.theme.color.white1};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
  box-shadow: ${(p) => p.theme.shadow.medium};

  ${(p) => p.transparent && UiNavBar__transpatent};
`

const Container = styled.div`
  height: 5rem;
  display: flex;
  align-items: center;

  ${(p) => p.theme.media.md.up} {
    height: 8rem;
  }
`

const List = styled.div`
  margin: 0 0 0 auto;

  ${(p) => p.theme.media.sm.down} {
    display: none;
  }
`

const MobileList__open = css`
  display: block;
`

const MobileList = styled.div<{ isOpen?: boolean }>`
  display: none;
  position: absolute;
  top: 5rem;
  right: 0;
  left: 0;
  background: ${(p) => p.theme.color.white1};
  padding: ${(p) => p.theme.spacing(1)};
  border-bottom: 0.1rem solid ${(p) => p.theme.color.gray2};
  border-left: 0.1rem solid ${(p) => p.theme.color.gray2};
  color: ${(p) => p.theme.color.gray7};
  box-shadow: ${(p) => p.theme.shadow.lift};
  max-height: calc(100vh - 6rem);
  overflow: auto;

  ${(p) => p.isOpen && MobileList__open};

  ${(p) => p.theme.media.xs.up} {
    left: initial;
  }

  ${(p) => p.theme.media.md.up} {
    display: none;
  }
`

const TextLogo__transparent = css`
  ${(p) => p.theme.media.sm.up} {
    display: none;
  }
`

const TextLogo = styled.h1<{
  transparent?: boolean
}>`
  font-size: 2.4rem;
  color: inherit;
  margin: 0;

  a {
    text-decoration: none;

    &:hover {
      color: inherit;
    }
  }

  ${(p) => p.transparent && TextLogo__transparent};
`

const Toggle = styled.button`
  padding: 0;
  margin: 0 0 0 auto;
  border: none;
  background: none;
  cursor: pointer;
  color: inherit;

  ${(p) => p.theme.media.md.up} {
    display: none;
  }
`

const ToggleIcon = styled.span`
  height: 3.2rem;
`

export default createUiComponent(UiNavBar, {
  Container,
  List,
  MobileList,
  TextLogo,
  Toggle,
  ToggleIcon
})
