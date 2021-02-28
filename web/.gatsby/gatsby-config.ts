import _ from 'lodash'
import blockNormalizer from '../src/components/block/normalizer'
import navNormalizer from '../src/components/nav/normalizer'
import galleryNormalizer from '../src/components/gallery/normalizer'
import homeNormalizer from '../src/components/home/normalizer'
import articleNormalizer from '../src/components/article/normalizer'
import { config } from 'dotenv'
import { composeNormalizers, getAcfImageNormalizer } from '../src/utils/normalizer'

config()

const ADMIN_URL = `${process.env.ADMIN_PROTOCOL}://${process.env.ADMIN_URL}`

const searchAndReplace = {
  sourceUrl: ADMIN_URL,
  replacementUrl: ''
}

function searchReplaceContentUrls({ entities, searchAndReplaceContentUrls }) {
  if (
    !_.isPlainObject(searchAndReplaceContentUrls) ||
    !_.has(searchAndReplaceContentUrls, `sourceUrl`) ||
    !_.has(searchAndReplaceContentUrls, `replacementUrl`) ||
    typeof searchAndReplaceContentUrls.sourceUrl !== `string` ||
    typeof searchAndReplaceContentUrls.replacementUrl !== `string`
  ) {
    return entities
  }

  const { sourceUrl, replacementUrl } = searchAndReplaceContentUrls

  const _blacklist = [`_links`, `__type`, `source_url`]

  const blacklistProperties = function (obj = {}, blacklist = []) {
    for (let i = 0; i < blacklist.length; i++) {
      delete obj[blacklist[i]]
    }

    return obj
  }

  return entities.map(function (entity) {
    const original = Object.assign({}, entity)

    try {
      const whiteList = blacklistProperties(entity, _blacklist)
      const replaceable = JSON.stringify(whiteList)
      const replaced = replaceable.replace(
        new RegExp(`href=\'${sourceUrl}`, `g`),
        `href=\'${replacementUrl}`
      ).replace(
        new RegExp(`"url":"${sourceUrl}`, `g`),
        `"url":"${replacementUrl}`
      )
      const parsed = JSON.parse(replaced)

      if (typeof parsed?.link === 'string') {
        parsed.link = parsed.link.replace(
          new RegExp(sourceUrl, `g`),
          replacementUrl
        )
      }

      if (typeof parsed?.url === 'string') {
        parsed.url = parsed.url.replace(
          new RegExp(sourceUrl, `g`),
          replacementUrl
        )
      }

      return _.defaultsDeep(parsed, original)
    } catch (e) {
      console.log(e.message)
      return original
    }
  })
}

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
        keepMediaSizes: true,
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
          '/filebird/**',
          '/wp-site-health/**',
          '/batch/**'
        ],
        searchAndReplaceContentUrls: searchAndReplace,
        normalizer: composeNormalizers(
          blockNormalizer(searchAndReplace),
          navNormalizer,
          galleryNormalizer,
          getAcfImageNormalizer('wordpress__wp_employee', 'photo'),
          getAcfImageNormalizer('wordpress__wp_gutak', 'preview'),
          homeNormalizer,
          articleNormalizer
        ),
        normalizers: (normalizers) => {
          return normalizers
            .filter((normalizer) => normalizer.name !== 'downloadMediaFiles')
            .map((normalizer) => {
              if (normalizer.name === 'searchReplaceContentUrls') {
                return {
                  ...normalizer,
                  normalizer: searchReplaceContentUrls
                }
              }

              return normalizer
            })
        }
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
