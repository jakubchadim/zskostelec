import React from 'react'
import styled from 'styled-components'
import UiShape from '../shape/shape'
import { createUiComponent } from '../utils'

const UiFooterShape = styled(UiShape)`
  color: ${(p) => p.theme.color.gray9};
`

const Footer: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children
}) => (
  <>
    <UiFooterShape />
    <footer className={className}>{children}</footer>
  </>
)

const UiFooter = styled(Footer)`
  background: ${(p) => p.theme.color.gray9};
  color: ${(p) => p.theme.color.white1};
`

const Container = styled.div`
  padding: ${(p) => p.theme.spacing(8, 0)};
  font-size: 0.875em;
  margin: 0 auto;
  max-width: 50rem;

  ${(p) => p.theme.media.sm.up} {
    padding: ${(p) => p.theme.spacing(12, 0, 10)};
  }

  ${(p) => p.theme.media.md.up} {
    padding: ${(p) => p.theme.spacing(16, 0, 12)};
    max-width: initial;
  }
`

const Info = styled.div`
  text-align: center;
  margin-top: ${(p) => p.theme.spacing(6)};
  opacity: 0.5;
`

const Contact = styled.div`
  opacity: 0.7;
  text-align: center;

  ${(p) => p.theme.media.sm.up} {
    margin-top: ${(p) => p.theme.spacing(4)};
  }

  ${(p) => p.theme.media.md.up} {
    text-align: initial;
    margin: 0;
  }
`

const Phone = styled.div`
  margin-top: ${(p) => p.theme.spacing(2)};

  a {
    text-decoration: none;
    margin-left: ${(p) => p.theme.spacing(1)};
  }
`

const Logo = styled.img`
  display: block;
  height: 9rem;
  opacity: 0.5;
  margin: 0 auto;
`

export default createUiComponent(UiFooter, {
  Container,
  Info,
  Contact,
  Logo,
  Phone
})
