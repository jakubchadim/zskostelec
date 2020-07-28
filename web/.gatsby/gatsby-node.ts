const path = require('path')
const slash = require('slash')

function gql (query: TemplateStringsArray): string {
  return query.toString()
}

type AllPagesData = {
  allWordpressPage: {
    edges: {
      node: {
        id: string
        slug: string
        status: any
        template: string
        link: string
      }
    }
  }
}

const allPagesQuery = gql`
  {
    allWordpressPage {
      edges {
        node {
          id
          slug
          status
          template
          link
        }
      }
    }
  }
`

const allPostsQuery = gql`
  {
    allWordpressPost {
      edges {
        node {
          id
          title
          slug
          link
        }
      }
    }
  }
`

export async function createPages ({ graphql, actions, reporter }): Promise<void> {
  const { createPage } = actions

  const allPages = await graphql(allPagesQuery)
  const allPosts = await graphql(allPostsQuery)

  // Handle errors
  if (allPages.errors || allPosts.errors) {
    reporter.panicOnBuild(`Error while running GraphQL queries.`)
    return
  }

  const pageTemplate = slash(path.resolve('./src/templates/page.tsx'))
  const postTemplate = slash(path.resolve('./src/templates/post.tsx'))

  const templateByType = {
    'page-home': slash(path.resolve('./src/templates/home.tsx'))
  }

  // Create page for each WordPress page
  allPages.data.allWordpressPage.edges.forEach(({node: page}) => {
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
  allPosts.data.allWordpressPost.edges.forEach(({node: post}) => {
    createPage({
      path: post.link,
      component: postTemplate,
      context: {
        id: post.id
      }
    })
  })
}
