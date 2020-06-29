import React from 'react'
import { Helmet } from 'react-helmet'
import { useSEOQuery } from './seo.query'

type SEOProps = {
  title?: string
  description?: string
  lang?: string
  meta?: {
    name: string
    content: string
  }[]
}

const SEO: React.FC<SEOProps> = ({ description, lang, meta, title }) => {
  const { site, wordpressSiteMetadata } = useSEOQuery()

  const metaDescription =
    description ||
    wordpressSiteMetadata.description ||
    site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | ${
        wordpressSiteMetadata.name || site.siteMetadata.title
      }`}
      meta={[
        {
          name: 'description',
          content: metaDescription
        },
        {
          property: 'og:title',
          content: title
        },
        {
          property: 'og:description',
          content: metaDescription
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        // {
        //   name: 'twitter:creator',
        //   content: site.siteMetadata.author,
        // },
        {
          name: 'twitter:title',
          content: title
        },
        {
          name: 'twitter:description',
          content: metaDescription
        },
        ...(meta || [])
      ]}
    />
  )
}

SEO.defaultProps = {
  lang: 'cs',
  description: ''
}

export default SEO
