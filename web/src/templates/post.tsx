import React from 'react'
import { graphql, PageProps } from 'gatsby'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiSection from '../components/ui/section/section'
import { DateString, RawHTML } from '../types'

type WordpressPostData = {
  wordpressPost: {
    title: string
    content: RawHTML
    date: DateString
    blocks: TransformedBlock[]
  }
}

export const query = graphql`
  query currentPostQuery($id: String!) {
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
  }
`

type PostProps = PageProps<WordpressPostData>

const Post: React.FC<PostProps> = ({ data: { wordpressPost } }) => {
  const parsedBlocks = React.useMemo(
    () => parseBlocks(wordpressPost.blocks || []),
    [wordpressPost.blocks]
  )

  const title = (
    <UiContainer>
      <h1>{wordpressPost.title}</h1>
    </UiContainer>
  )

  return (
    <Layout>
      <SEO title={wordpressPost.title} />
      {parsedBlocks.length ? (
        <BlockContent blocks={parsedBlocks} title={title} />
      ) : (
        <UiSection>
          {title}
          <Content content={wordpressPost.content} />
        </UiSection>
      )}
    </Layout>
  )
}

export default Post
