import { AllCategoryQuery, allCategoryQuery } from './gql/allCategory.query'
import { AllGalleryQuery, allGalleryQuery } from './gql/allGallery.query'
import { allPageQuery, AllPageQuery, PageInfo } from './gql/allPage.query'
import { allPostQuery, AllPostQuery } from './gql/allPost.query'
import { filteredPostQuery, FilteredPostQuery } from './gql/filteredPost.query'
import { SinglePostQuery, singlePostQuery } from './gql/singlePost.query'
import { extractNodes } from './gql/utils'
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const path = require('path')
const slash = require('slash')

enum TemplateType {
  HOME = 'page-home',
  GALLERIES = 'page-galleries',
  DOCUMENTS = 'page-documents',
  GUTAKY = 'page-gutak',
  EMPLOYEES = 'page-employees'
}

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
  const allCategoryFormatted = extractNodes(allCategory.data.allWordpressCategory)
  const defaultCategoryId = allCategoryFormatted[0]?.id

  const pageTemplate = slash(path.resolve('./src/templates/page.tsx'))
  const postTemplate = slash(path.resolve('./src/templates/post.tsx'))
  const galleryTemplate = slash(path.resolve('./src/templates/gallery.tsx'))
  const categoryTemplate = slash(path.resolve('./src/templates/category.tsx'))

  // Create posts for each WordPress post
  const posts = allPost.data.allWordpressPost.edges.map(({node: post}) => post)
  posts.forEach((post) => {
    createPage({
      path: post.link,
      component: postTemplate,
      context: {
        id: post.id,
        categoryId: post.categories[0]?.id || defaultCategoryId
      }
    })
  })

  const templateByType = {
    [TemplateType.HOME]: slash(path.resolve('./src/templates/home.tsx')),
    [TemplateType.GALLERIES]: slash(path.resolve('./src/templates/allGallery.tsx')),
    [TemplateType.DOCUMENTS]: slash(path.resolve('./src/templates/allDocument.tsx')),
    [TemplateType.GUTAKY]: slash(path.resolve('./src/templates/allGutak.tsx')),
    [TemplateType.EMPLOYEES]: slash(path.resolve('./src/templates/allEmployee.tsx'))
  }

  async function getPageContext (templateType: TemplateType, page: PageInfo) {
    if (templateType === TemplateType.HOME) {
      const categories = [
        page?.acf?.mainCategory,
        page?.acf?.additionalCategoryFirst,
        page?.acf?.additionalCategorySecond
      ].filter((category) => category != null)

      const mainId = page?.acf?.mainPost

      let mainPost: SinglePostQuery['data']['wordpressPost'] | undefined = mainId
        ? (await graphql(singlePostQuery(mainId)))?.data?.wordpressPost
        : undefined

      const articlePreviews = await Promise.all(categories.map(async ({slug}, idx) => {
        const articles: FilteredPostQuery = await graphql(filteredPostQuery(slug, idx === 0 ? 6 : 3, mainId))

        return {
          category: allCategoryFormatted.find((category) => category.slug === slug),
          articles: extractNodes(articles.data.allWordpressPost)
        }
      }))

      if (!mainPost && articlePreviews[0]) {
        const [first, ...rest] = articlePreviews[0].articles
        mainPost = first
        articlePreviews[0].articles = rest
      }

      return {
        id: page.id,
        mainPost,
        articlePreviews: articlePreviews.filter((previews) => previews.articles.length > 0)
      }
    }

    return {
      id: page.id
    }
  }

  const pages = extractNodes(allPage.data.allWordpressPage).map((page) => {
    return {
      ...page,
      templateType: <TemplateType>page.template.replace('.php', '')
    }
  })

  for (const page of pages) {
    const template = templateByType[page.templateType] || pageTemplate

    createPage({
      path: page.link,
      component: template,
      context: await getPageContext(page.templateType, page)
    })
  }

  // Create wp categories
  const paginationLimit = 15
  await Promise.all(
    allCategory.data.allWordpressCategory.edges.map(async ({node: category}) => {
      const totalCount = posts.filter((post) => post.categories.some((c) => c.id === category.id)).length

      const numberOfPages = Math.ceil(totalCount / paginationLimit)

      for (let i = 0; i < numberOfPages; i++) {
        createPage({
          path: i === 0 ? category.link : `${category.link}strana-${i + 1}/`,
          component: categoryTemplate,
          context: {
            id: category.id,
            offset: i * paginationLimit,
            limit: paginationLimit,
            totalCount,
            basePath: category.link
          }
        })
      }
    })
  )

  const galleryPage = pages.find((page) => page.templateType === TemplateType.GALLERIES)
  const allGalleryLink = galleryPage?.link

  // Create gallery for each WordPress gallery
  allGallery.data.allWordpressWpGallery.edges.forEach(({node: gallery}) => {
    createPage({
      path: gallery.link,
      component: galleryTemplate,
      context: {
        id: gallery.id,
        allGalleryLink
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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type wordpress__PAGEBlocks implements Node {
      parentId: String
    }
    
    type wordpress__POSTBlocks implements Node {
      parentId: String
    }
  
    type wordpress__wp_employeeAcf implements Node {
      photo: wordpress__wp_media
    }

    type wordpress__wp_gutakAcf implements Node {
      preview: wordpress__wp_media
    }

    type wordpress__wp_galleryAcf implements Node {
      preview: wordpress__wp_media
      gallery: [wordpress__wp_media!]
    }

    type wordpress__PAGEAcf implements Node {
      mainPost: Int
    }
  `

  createTypes(typeDefs)
}
