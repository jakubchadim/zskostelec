import { number } from '@storybook/addon-knobs'
import React from 'react'
import { Link, graphql, PageProps } from 'gatsby'
import { BlockColor } from '../components/block/color/color'
import { BlockCoreButtonType } from '../components/block/core/button/constants'
import UiNavPagination from '../components/nav/pagination'
import UiArticle from '../components/ui/article/article'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiSection from '../components/ui/section/section'
import { DateString, ID, RawHTML } from '../types'
import UiButton from '../components/ui/button/button'
import UiGrid from '../components/ui/grid/grid'
import UiBox from '../components/ui/box/box'

type WordpressCategoryData = {
  wordpressCategory: {
    name: string
  }
  allWordpressPost: {
    edges: {
      node: {
        id: ID
        date: DateString
        title: string
        excerpt: RawHTML
        link: string
      }
    }[]
  }
}

export const query = graphql`
  query currentCategoryQuery($id: String!, $offset: Int!, $limit: Int!) {
    wordpressCategory(id: { eq: $id }) {
      name
    }
    allWordpressPost(
      limit: $limit
      skip: $offset
      filter: {
        status: { eq: "publish" }
        categories: { elemMatch: { id: { eq: $id } } }
      }
    ) {
      edges {
        node {
          id
          date(formatString: "DD.MM. YYYY")
          title
          excerpt
          link
        }
      }
    }
  }
`

type CategoryProps = PageProps<
  WordpressCategoryData,
  {
    limit: number
    offset: number
    totalCount: number
    basePath: string
  }
>

const Category: React.FC<CategoryProps> = ({
  data: { wordpressCategory, allWordpressPost },
  pageContext,
  ...rest
}) => {
  return (
    <Layout>
      <SEO title={wordpressCategory.name} />
      <UiSection>
        <UiContainer>
          <h1>{wordpressCategory.name}</h1>
          <UiGrid largeGutter>
            {allWordpressPost.edges.map(({ node: post }) => (
              <UiGrid.Item md={4} key={post.id}>
                <UiBox backgroundColor={BlockColor.MEDIUM_GRAY}>
                  <UiBox.Header>
                    <UiArticle.Header>
                      <UiArticle.Title
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                    </UiArticle.Header>
                  </UiBox.Header>
                  <UiBox.Content>
                    <UiArticle.Perex
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <UiArticle.Footer>
                      <UiButton
                        as={Link}
                        to={post.link}
                        themeType={BlockCoreButtonType.OUTLINE}
                        backgroundColor={BlockColor.MEDIUM_GRAY}
                        textColor={BlockColor.BLACK}
                      >
                        Zobrazit
                      </UiButton>
                      <UiArticle.Date>{post.date}</UiArticle.Date>
                    </UiArticle.Footer>
                  </UiBox.Content>
                </UiBox>
              </UiGrid.Item>
            ))}
          </UiGrid>
          <UiSection.Pagination>
            <UiNavPagination
              totalCount={Math.ceil(pageContext.totalCount / pageContext.limit)}
              current={pageContext.offset / pageContext.limit + 1}
              generateLink={(page) =>
                page === 1
                  ? pageContext.basePath
                  : `${pageContext.basePath}strana-${page}`
              }
            />
          </UiSection.Pagination>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Category
