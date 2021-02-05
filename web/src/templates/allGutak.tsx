import { graphql, PageProps } from 'gatsby'
import React from 'react'
import { BlockColor } from '../components/block/color/color'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import UiGallery from '../components/ui/gallery/gallery'
import UiSectionOffset from '../components/ui/section/offset'
import UiGrid from '../components/ui/grid/grid'
import UiSection from '../components/ui/section/section'
import UiShape from '../components/ui/shape/shape'
import defaultGutakImage from '../images/gutak.png'

import { RawHTML } from '../types'

type WordpressAllGutakData = {
  wordpressPage: {
    title: string
    content: RawHTML
    blocks: TransformedBlock[]
  }
  allWordpressWpGutak: {
    edges: {
      node: {
        id: string
        title: string
        date: string
        link: string
        acf: {
          file: {
            url: {
              source_url: string
            }
          }
          preview?: {
            source_url: string
            media_details?: {
              sizes?: {
                medium_large?: {
                  source_url: string
                }
              }
            }
          }
        }
      }
    }[]
  }
}

export const query = graphql`
  query allGutakQuery($id: String!) {
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
    allWordpressWpGutak(filter: { acf: { file: { link: { ne: null } } } }) {
      edges {
        node {
          id
          title
          acf {
            file {
              url {
                source_url
              }
            }
            preview {
              id
              source_url
              media_details {
                sizes {
                  medium_large {
                    source_url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

type AllGutakProps = PageProps<WordpressAllGutakData>

const AllGutak: React.FC<AllGutakProps> = ({
  data: { wordpressPage, allWordpressWpGutak }
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

  const allGutak = (
    <UiContainer>
      <UiSectionOffset>
        <UiGrid>
          {allWordpressWpGutak.edges.map(({ node: gutak }) => {
            return (
              <UiGrid.Item key={gutak.id} xs={6} sm={4}>
                <a
                  href={gutak.acf.file.url?.source_url}
                  target='_blank'
                  rel='noreferrer'
                >
                  <UiGallery>
                    <UiGallery.Image>
                      {gutak.acf?.preview ? (
                        <img
                          src={
                            gutak.acf.preview.media_details?.sizes?.medium_large
                              ?.source_url || gutak.acf.preview.source_url
                          }
                          alt={gutak.title}
                        />
                      ) : (
                        <img src={defaultGutakImage} alt={gutak.title} />
                      )}
                    </UiGallery.Image>
                    <UiGallery.Overlay>
                      <UiShape color={BlockColor.WHITE} />
                      <UiGallery.Title>{gutak.title}</UiGallery.Title>
                    </UiGallery.Overlay>
                  </UiGallery>
                </a>
              </UiGrid.Item>
            )
          })}
        </UiGrid>
      </UiSectionOffset>
    </UiContainer>
  )

  return (
    <Layout>
      <SEO title={wordpressPage.title} />
      {parsedBlocks.length ? (
        <BlockContent blocks={parsedBlocks} title={title} footer={allGutak} />
      ) : (
        <UiSection>
          {title}
          <Content content={wordpressPage.content} />
          {allGutak}
        </UiSection>
      )}
    </Layout>
  )
}

export default AllGutak
