import { graphql, Link, PageProps } from 'gatsby'
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
import { RawHTML } from '../types'

type WordpressAllGalleryData = {
  wordpressPage: {
    title: string
    content: RawHTML
    blocks: TransformedBlock[]
  }
  allWordpressWpGallery: {
    edges: {
      node: {
        id: string
        title: string
        date: string
        link: string
        acf: {
          preview: {
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
  query allGalleryQuery($id: String!) {
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
    allWordpressWpGallery(
      filter: { acf: { preview: { link: { ne: null } } } }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
          id
          title
          date(formatString: "DD.MM. YYYY")
          link
          acf {
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

type AllGalleryProps = PageProps<WordpressAllGalleryData>

const AllGallery: React.FC<AllGalleryProps> = ({
  data: { wordpressPage, allWordpressWpGallery }
}) => {
  const parsedBlocks = React.useMemo(
    () => parseBlocks(wordpressPage.blocks || []),
    [wordpressPage.blocks]
  )

  const title = (
    <UiContainer>
      <h1 className='top'>{wordpressPage.title}</h1>
    </UiContainer>
  )

  const gallery = (
    <UiContainer>
      <UiSectionOffset>
        <UiGrid>
          {allWordpressWpGallery.edges.map(({ node: gallery }) => {
            return (
              <UiGrid.Item key={gallery.id} xs={6} md={4}>
                <Link to={gallery.link}>
                  <UiGallery>
                    <UiGallery.Image>
                      <img
                        src={
                          gallery.acf.preview.media_details?.sizes?.medium_large
                            ?.source_url || gallery.acf.preview.source_url
                        }
                        alt={gallery.title}
                      />
                    </UiGallery.Image>
                    <UiGallery.Overlay>
                      <UiShape color={BlockColor.WHITE} />
                      <UiGallery.Label>{gallery.date}</UiGallery.Label>
                      <UiGallery.Title>{gallery.title}</UiGallery.Title>
                    </UiGallery.Overlay>
                  </UiGallery>
                </Link>
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
        <BlockContent blocks={parsedBlocks} title={title} footer={gallery} />
      ) : (
        <UiSection>
          {title}
          <Content content={wordpressPage.content} />
          {gallery}
        </UiSection>
      )}
    </Layout>
  )
}

export default AllGallery
