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
  padding: 5rem 0;
  text-align: center;
`

export default createUiComponent(UiFooter, {
  Container
})
