import React from 'react'
import { useNavFastSecondQuery } from './fastSecond.query'
import NavSimple from './simple'

type NavFastSecondProps = {
  transparent?: boolean
  inline?: boolean
  simple?: boolean
  fill?: boolean
}

const NavFastSecond: React.FC<NavFastSecondProps> = (props) => {
  const nav = useNavFastSecondQuery()

  return <NavSimple {...props} items={nav.items} />
}

export default React.memo(NavFastSecond)
