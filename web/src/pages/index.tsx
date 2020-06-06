import React from 'react'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'

const HomePage: React.FC = () => {
  return (
    <Layout>
      <SEO title='Vítejte' />
      <h1>Homepage</h1>
    </Layout>
  )
}

export default HomePage
