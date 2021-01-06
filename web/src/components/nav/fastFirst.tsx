import React from 'react'
import { useNavFastFirstQuery } from './fastFirst.query'
import NavSimple from './simple'

type NavFastFirstProps = {
  transparent?: boolean
  inline?: boolean
  simple?: boolean
  fill?: boolean
}

const NavFastFirst: React.FC<NavFastFirstProps> = (props) => {
  const nav = useNavFastFirstQuery()

  return <NavSimple {...props} items={nav.items} />
}

export default React.memo(NavFastFirst)
