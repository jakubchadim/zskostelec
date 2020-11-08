import { graphql, Link, PageProps } from 'gatsby'
import { FixedObject } from 'gatsby-image'
import React from 'react'
import Img from 'gatsby-image'
import { BlockColor } from '../components/block/color/color'
import BlockContent from '../components/block/content'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import UiGallery from '../components/ui/gallery/gallery'
import UiGalleryOffset from '../components/ui/gallery/offset'
import UiGrid from '../components/ui/grid/grid'
import UiSection from '../components/ui/section/section'
import UiShape from '../components/ui/shape/shape'
import { Nullable, RawHTML } from '../types'

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
        link: string
        acf: {
          date: string
          preview: {
            source_url: string
            localFile: {
              preview: Nullable<{
                fixed: FixedObject
              }>
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
    allWordpressWpGallery {
      edges {
        node {
          id
          acf {
            date
            preview {
              id
              source_url
              localFile {
                preview: childImageSharp {
                  fixed(width: 400, height: 400, cropFocus: CENTER) {
                    ...GatsbyImageSharpFixed
                  }
                }
              }
            }
          }
          link
          title
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
      <h1>{wordpressPage.title}</h1>
    </UiContainer>
  )

  const gallery = (
    <UiContainer>
      <UiGalleryOffset>
        <UiGrid>
          {allWordpressWpGallery.edges.map(({ node: gallery }) => {
            const preview = gallery.acf.preview.localFile.preview

            return (
              <UiGrid.Item key={gallery.id} xs={6} sm={4}>
                <Link to={gallery.link}>
                  <UiGallery>
                    <UiGallery.Image>
                      {preview?.fixed ? (
                        <Img fixed={preview.fixed} alt={gallery.title} />
                      ) : (
                        <img
                          src={gallery.acf.preview.source_url}
                          alt={gallery.title}
                        />
                      )}
                    </UiGallery.Image>
                    <UiGallery.Overlay>
                      <UiShape color={BlockColor.WHITE} />
                      <UiGallery.Label>{gallery.acf.date}</UiGallery.Label>
                      <UiGallery.Title>{gallery.title}</UiGallery.Title>
                    </UiGallery.Overlay>
                  </UiGallery>
                </Link>
              </UiGrid.Item>
            )
          })}
        </UiGrid>
      </UiGalleryOffset>
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
