import { AllCategoryQuery, allCategoryQuery } from './gql/allCategory.query'
import { AllGalleryQuery, allGalleryQuery } from './gql/allGallery.query'
import { allPageQuery, AllPageQuery } from './gql/allPage.query'
import { allPostQuery, AllPostQuery } from './gql/allPost.query'
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const path = require('path')
const slash = require('slash')


export async function createPages ({ graphql, actions, reporter }): Promise<void> {
  const { createPage } = actions

  const allPage: AllPageQuery = await graphql(allPageQuery)
  const allPost: AllPostQuery = await graphql(allPostQuery)
  const allGallery: AllGalleryQuery = await graphql(allGalleryQuery)
  const allCategory: AllCategoryQuery = await graphql(allCategoryQuery)

  // Handle errors
  if (allPage.errors || allPost.errors) {
    reporter.panicOnBuild(`Error while running GraphQL queries.`)
    return
  }

  // Fallback
  const defaultCategoryId = allCategory.data.allWordpressCategory.edges[0].node.id

  const pageTemplate = slash(path.resolve('./src/templates/page.tsx'))
  const postTemplate = slash(path.resolve('./src/templates/post.tsx'))
  const galleryTemplate = slash(path.resolve('./src/templates/gallery.tsx'))
  const categoryTemplate = slash(path.resolve('./src/templates/category.tsx'))

  const templateByType = {
    'page-home': slash(path.resolve('./src/templates/home.tsx')),
    'page-galleries': slash(path.resolve('./src/templates/allGallery.tsx'))
  }

  // Create page for each WordPress page
  allPage.data.allWordpressPage.edges.forEach(({node: page}) => {
    const template = templateByType[page.template.replace('.php', '')] || pageTemplate

    createPage({
      path: page.link,
      component: template,
      context: {
        id: page.id
      }
    })
  })

  // Create posts for each WordPress post
  allPost.data.allWordpressPost.edges.forEach(({node: post}) => {
    createPage({
      path: post.link,
      component: postTemplate,
      context: {
        id: post.id,
        categoryId: post.categories[0]?.id || defaultCategoryId
      }
    })
  })

  // Create wp categories
  allCategory.data.allWordpressCategory.edges.forEach(({node: category}) => {
    console.log('page', category.link)
    createPage({
      path: category.link,
      component: categoryTemplate,
      context: {
        id: category.id
      }
    })
  })

  // Create gallery for each WordPress gallery
  allGallery.data.allWordpressWpGallery.edges.forEach(({node: gallery}) => {
    createPage({
      path: gallery.link,
      component: galleryTemplate,
      context: {
        id: gallery.id
      }
    })
  })
}

exports.createResolvers = ({
   actions,
   cache,
   createNodeId,
   createResolvers,
   getNode,
   store,
   reporter
}) => {
  const { createNode, touchNode } = actions

  // Add all media libary images so they can be queried by
  // childImageSharp
  createResolvers({
    WPGraphQL_MediaItem: {
      imageFile: {
        type: `File`,
        async resolve (source, args, context, info) {
          if (source.sourceUrl) {
            let fileNodeID
            let fileNode
            let sourceModified

            // Set the file cacheID, get it (if it has already been set)
            const mediaDataCacheKey = `wordpress-media-${source.mediaItemId}`
            const cacheMediaData = await cache.get(mediaDataCacheKey)

            if (source.modified) {
              sourceModified = source.modified
            }

            // If we have cached media data and it wasn't modified, reuse
            // previously created file node to not try to redownload
            if (cacheMediaData && sourceModified === cacheMediaData.modified) {
              fileNode = getNode(cacheMediaData.fileNodeID)

              // check if node still exists in cache
              // it could be removed if image was made private
              if (fileNode) {
                fileNodeID = cacheMediaData.fileNodeID
                // https://www.gatsbyjs.org/docs/node-creation/#freshstale-nodes
                touchNode({
                  nodeId: fileNodeID
                })
              }
            }

            // If we don't have cached data, download the file
            if (!fileNodeID) {
              try {
                // Get the filenode
                fileNode = await createRemoteFileNode({
                  url: source.sourceUrl,
                  store,
                  cache,
                  createNode,
                  createNodeId,
                  reporter
                })

                if (fileNode) {
                  fileNodeID = fileNode.id

                  await cache.set(mediaDataCacheKey, {
                    fileNodeID,
                    modified: sourceModified
                  })
                }
              } catch (e) {
                // Ignore
                console.log(e)
                return null
              }
            }

            if (fileNode) {
              return fileNode
            }
          }
          return null
        }
      }
    }
  })
}
