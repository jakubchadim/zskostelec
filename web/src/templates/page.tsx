import { graphql, PageProps } from 'gatsby'
import React from 'react'
import BlockList from '../components/block/list'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import { RawHTML } from '../types'

type WordpressPageData = {
  wordpressPage: {
    title: string
    content: RawHTML
    blocks: TransformedBlock[]
  }
}

export const query = graphql`
  query currentPageQuery($id: String!) {
    wordpressPage(id: { eq: $id }) {
      title
      content
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

const Page: React.FC<PageProps<WordpressPageData>> = ({
  data: { wordpressPage }
}) => {
  const parsedBlocks = React.useMemo(
    () => parseBlocks(wordpressPage.blocks || []),
    [wordpressPage.blocks]
  )

  return (
    <Layout>
      <SEO title={wordpressPage.title} />
      <h1>{wordpressPage.title}</h1>
      {parsedBlocks.length ? (
        <BlockList blocks={parsedBlocks} />
      ) : (
        <Content content={wordpressPage.content} />
      )}
    </Layout>
  )
}

export default Page
