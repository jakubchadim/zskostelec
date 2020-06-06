import React from 'react'
import NavMain from '../nav/main'

const Layout: React.FC = ({ children }) => (
  <>
    <NavMain />
    {children}
  </>
)

export default Layout
