import React from 'react'
import { graphql, PageProps } from 'gatsby'
import BlockList from '../components/block/list'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
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

  return (
    <Layout>
      <SEO title={wordpressPost.title} />
      <h1>{wordpressPost.title}</h1>
      {parsedBlocks.length ? (
        <BlockList blocks={parsedBlocks} />
      ) : (
        <Content content={wordpressPost.content} />
      )}
    </Layout>
  )
}

export default Post
