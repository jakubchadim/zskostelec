import { Link } from 'gatsby'
import React from 'react'

import { useNavMainQuery } from './main.query'

const NavMain: React.FC = () => {
  const { wordpressWpApiMenusMenusItems } = useNavMainQuery()

  return (
    <nav>
      {wordpressWpApiMenusMenusItems.items.map((item, idx) => {
        if (item.url.startsWith('http') || item.target === '_blank') {
          return (
            <a key={idx} href={item.url} target={item.target}>
              {item.title}
            </a>
          )
        }

        return (
          <Link key={idx} to={item.url || '/'}>
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

export default NavMain
