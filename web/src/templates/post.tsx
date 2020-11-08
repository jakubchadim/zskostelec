import React from 'react'
import { graphql, Link, PageProps } from 'gatsby'
import { BlockColor } from '../components/block/color/color'
import { BlockCoreButtonType } from '../components/block/core/button/constants'
import BlockList from '../components/block/list'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiGrid from '../components/ui/grid/grid'
import UiArticle from '../components/ui/article/article'
import UiButton from '../components/ui/button/button'
import UiBox from '../components/ui/box/box'
import UiSection from '../components/ui/section/section'
import { DateString, ID, RawHTML } from '../types'

type WordpressPostData = {
  wordpressPost: {
    title: string
    content: RawHTML
    date: DateString
    blocks: TransformedBlock[]
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
  query currentPostQuery($id: String!, $categoryId: String!) {
    wordpressPost(id: { eq: $id }) {
      title
      content
      date(formatString: "MMMM DD, YYYY")
      blocks {
        blockId
        parentId
        type
        attrs
        content
      }
    }
    allWordpressPost(
      filter: {
        id: { ne: $id }
        categories: { elemMatch: { id: { eq: $categoryId } } }
      }
      limit: 3
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

type PostProps = PageProps<WordpressPostData>

const Post: React.FC<PostProps> = ({
  data: { wordpressPost, allWordpressPost }
}) => {
  const parsedBlocks = React.useMemo(
    () => parseBlocks(wordpressPost.blocks || []),
    [wordpressPost.blocks]
  )

  return (
    <Layout>
      <SEO title={wordpressPost.title} />
      <UiSection>
        <UiContainer>
          <UiGrid largeGutter>
            <UiGrid.Item md={8}>
              <h1 dangerouslySetInnerHTML={{ __html: wordpressPost.title }} />
              {parsedBlocks.length ? (
                <BlockList blocks={parsedBlocks} nested />
              ) : (
                <Content content={wordpressPost.content} />
              )}
            </UiGrid.Item>
            <UiGrid.Item md={4}>
              <UiGrid>
                {allWordpressPost.edges.map(({ node: post }) => (
                  <UiGrid.Item md={12} key={post.id}>
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
            </UiGrid.Item>
          </UiGrid>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Post
