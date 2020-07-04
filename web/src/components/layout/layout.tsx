import React from 'react'
import { GlobalStyle } from '../../theme/global'
import NavMain from '../nav/main'

const Layout: React.FC = ({ children }) => (
  <>
    <GlobalStyle />
    <NavMain />
    {children}
  </>
)

export default Layout
