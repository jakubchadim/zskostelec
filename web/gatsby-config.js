require('dotenv').config()

const ADMIN_URL = `${process.env.ADMIN_PROTOCOL}://${process.env.ADMIN_URL}`

module.exports = {
  siteMetadata: {
    title: `ZŠ Kostelec nad Orlicí`,
    description: 'School web',
    siteUrl: process.env.SITE_URL
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ZŠ Kostelec nad Orlicí`,
        short_name: `zskostelec`,
        start_url: `/`,
        background_color: `#F46912`,
        theme_color: `#FCB826`,
        display: `minimal-ui`,
        icon: `src/images/logo.png` // This path is relative to the root of the site.
      }
    },
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        baseUrl: process.env.ADMIN_URL,
        protocol: process.env.ADMIN_PROTOCOL,
        hostingWPCOM: false,
        useACF: true,
        excludedRoutes: [
          '**/categories',
          '**/tags',
          '**/taxonomies',
          '**/users',
          '**/comments'
        ],
        searchAndReplaceContentUrls: {
          sourceUrl: ADMIN_URL,
          replacementUrl: ''
        }
      }
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-ts-config`
  ]
}
