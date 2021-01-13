import blockNormalizer from '../src/components/block/normalizer'
import navNormalizer from '../src/components/nav/normalizer'
import galleryNormalizer from '../src/components/gallery/normalizer'
import homeNormalizer from '../src/components/home/normalizer'
import { config } from 'dotenv'
import { composeNormalizers, getAcfImageNormalizer } from '../src/utils/normalizer'

config()

const ADMIN_URL = `${process.env.ADMIN_PROTOCOL}://${process.env.ADMIN_URL}`

module.exports = {
  pathPrefix: process.env.SITE_PREFIX,
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
        path: `${__dirname}/../src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ZŠ Kostelec nad Orlicí`,
        short_name: `zskostelec`,
        start_url: process.env.SITE_PREFIX,
        background_color: `#F46912`,
        theme_color: `#FCB826`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png` // This path is relative to the root of the site.
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
          '**/tags',
          '**/users',
          '**/comments',
          '**/settings',
          '**/themes',
          '**/users',
          '**/users/me',
          '**/search',
          '**/block-types',
          '**/plugins',
          '/wp/v2/block-directory/search',
          '/njt-fbv/**',
          'filebird/**'
        ],
        searchAndReplaceContentUrls: {
          sourceUrl: ADMIN_URL,
          replacementUrl: ''
        },
        normalizer: composeNormalizers(
          blockNormalizer,
          navNormalizer,
          galleryNormalizer,
          getAcfImageNormalizer('wordpress__wp_employee', 'photo'),
          getAcfImageNormalizer('wordpress__wp_gutak', 'preview'),
          homeNormalizer
        )
      }
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `roboto:300,400,400i,700`
        ],
        display: 'swap'
      }
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-typescript`
  ]
}
