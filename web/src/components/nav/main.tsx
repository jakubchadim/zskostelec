import { Link } from 'gatsby'
import React from 'react'
import UiNav from '../ui/nav/nav'
import UiContainer from '../ui/container/container'
import { useNavMainQuery } from './main.query'
import { isExternalLink } from './utils'

const NavLink = UiNav.Link.withComponent(Link)

const NavMain: React.FC = () => {
  const { wordpressWpApiMenusMenusItems } = useNavMainQuery()

  return (
    <UiNav>
      <UiContainer>
        <UiNav.Container>
          <UiNav.TextLogo>
            <Link to='/'>ZŠ Kostelec</Link>
          </UiNav.TextLogo>
          <UiNav.List>
            {wordpressWpApiMenusMenusItems.items.map((item, idx) => {
              const externalLink = isExternalLink(item.url, item.target)

              return (
                <UiNav.Item key={idx}>
                  {externalLink ? (
                    <UiNav.Link href={item.url} target={item.target}>
                      {item.title}
                    </UiNav.Link>
                  ) : (
                    <NavLink to={item.url || '/'}>{item.title}</NavLink>
                  )}
                </UiNav.Item>
              )
            })}
          </UiNav.List>
        </UiNav.Container>
      </UiContainer>
    </UiNav>
  )
}

export default NavMain
