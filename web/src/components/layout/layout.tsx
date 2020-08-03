import React from 'react'
import { GlobalStyle } from '../../theme/global'
import NavMain from '../nav/main'
import Footer from '../footer/footer'
import UiLayout from '../ui/layout/layout'

type LayoutProps = {
  transparentNav?: boolean
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ transparentNav, children }) => (
  <>
    <GlobalStyle />
    <UiLayout>
      <NavMain transparent={transparentNav} />
      <UiLayout.Content>{children}</UiLayout.Content>
      <Footer />
    </UiLayout>
  </>
)

export default Layout
