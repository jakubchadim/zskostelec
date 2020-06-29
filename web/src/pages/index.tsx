import React from 'react'
import SEO from '../components/seo/seo'

import Layout from '../components/layout/layout'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <SEO title='Vítejte' />
      <h1>Homepage</h1>
    </Layout>
  )
}

export default HomePage
