import { graphql, PageProps } from 'gatsby'
import React from 'react'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiSection from '../components/ui/section/section'
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

  const title = (
    <UiContainer>
      <h1>{wordpressPage.title}</h1>
    </UiContainer>
  )

  return (
    <Layout>
      <SEO title={wordpressPage.title} />
      {parsedBlocks.length ? (
        <BlockContent blocks={parsedBlocks} title={title} />
      ) : (
        <UiSection>
          {title}
          <Content content={wordpressPage.content} />
        </UiSection>
      )}
    </Layout>
  )
}

export default Page
