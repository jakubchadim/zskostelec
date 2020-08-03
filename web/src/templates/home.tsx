import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../components/block/color/color'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import UiShape from '../components/ui/shape/shape'

const MainHeading = styled.section`
  padding: 15.1rem 0 7rem;
  margin-top: -8.1rem;
  background: linear-gradient(
    180deg,
    ${(p) => p.theme.color.primary1} 0,
    ${(p) => p.theme.color.warning1} 100%
  );
  color: #fff;
`

const Home: React.FC = () => {
  return (
    <Layout transparentNav>
      <SEO title='Vítejte' />
      <MainHeading>
        <UiContainer>
          <h1>Homepage!</h1>
        </UiContainer>
      </MainHeading>
      <UiShape color={BlockColor.LIGHT_GRAY} />
    </Layout>
  )
}

export default Home
