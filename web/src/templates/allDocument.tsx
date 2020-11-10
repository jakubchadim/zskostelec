import { graphql, PageProps } from 'gatsby'
import React from 'react'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import { getFileIcon } from '../components/file/utils'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import UiDocumentOffset from '../components/ui/gallery/offset'
import UiGrid from '../components/ui/grid/grid'
import UiSection from '../components/ui/section/section'
import UiIcon from '../components/ui/icon/icon'
import { RawHTML } from '../types'

type WordpressAllDocumentData = {
  wordpressPage: {
    title: string
    content: RawHTML
    blocks: TransformedBlock[]
  }
  allWordpressWpDocument: {
    edges: {
      node: {
        id: string
        title: string
        acf: {
          file: {
            filename: string
            url: {
              localFile: {
                publicURL: string
                extension: string
              }
            }
          }
        }
      }
    }[]
  }
}

export const query = graphql`
  query allDocumentQuery($id: String!) {
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
    allWordpressWpDocument {
      edges {
        node {
          id
          acf {
            file {
              filename
              url {
                localFile {
                  publicURL
                  extension
                }
              }
            }
          }
          title
        }
      }
    }
  }
`

type AllDocumentProps = PageProps<WordpressAllDocumentData>

const AllDocument: React.FC<AllDocumentProps> = ({
  data: { wordpressPage, allWordpressWpDocument }
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

  const documents = (
    <UiContainer>
      <UiDocumentOffset>
        <UiGrid>
          {allWordpressWpDocument.edges.map(({ node: document }) => {
            return (
              <UiGrid.Item key={document.id} xs={6} sm={4}>
                <a
                  href={document.acf.file.url.localFile.publicURL}
                  target='_blank'
                  rel='noreferrer'
                >
                  <UiIcon
                    icon={getFileIcon(
                      document.acf.file.url.localFile.extension
                    )}
                  />
                  {document.title || document.acf.file.filename}
                </a>
              </UiGrid.Item>
            )
          })}
        </UiGrid>
      </UiDocumentOffset>
    </UiContainer>
  )

  return (
    <Layout>
      <SEO title={wordpressPage.title} />
      {parsedBlocks.length ? (
        <BlockContent blocks={parsedBlocks} title={title} footer={documents} />
      ) : (
        <UiSection>
          {title}
          <Content content={wordpressPage.content} />
          {documents}
        </UiSection>
      )}
    </Layout>
  )
}

export default AllDocument
