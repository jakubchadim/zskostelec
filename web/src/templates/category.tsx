import React from 'react'
import { Link, graphql, PageProps } from 'gatsby'
import { BlockColor } from '../components/block/color/color'
import { BlockCoreButtonType } from '../components/block/core/button/constants'
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
  query currentCategoryQuery($id: String!) {
    wordpressCategory(id: { eq: $id }) {
      name
    }
    allWordpressPost(
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

type CategoryProps = PageProps<WordpressCategoryData>

const Category: React.FC<CategoryProps> = ({
  data: { wordpressCategory, allWordpressPost }
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
                    <Link to={post.link}>
                      <UiButton
                        themeType={BlockCoreButtonType.OUTLINE}
                        backgroundColor={BlockColor.MEDIUM_GRAY}
                        textColor={BlockColor.BLACK}
                      >
                        Více informací
                      </UiButton>
                    </Link>
                  </UiBox.Content>
                </UiBox>
              </UiGrid.Item>
            ))}
          </UiGrid>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Category
