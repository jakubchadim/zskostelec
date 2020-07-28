import React from 'react'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'

import Layout from '../components/layout/layout'

const Home: React.FC = () => {
  return (
    <Layout>
      <SEO title='Vítejte' />
      <UiContainer>
        <h1>Homepage!</h1>
      </UiContainer>
    </Layout>
  )
}

export default Home
