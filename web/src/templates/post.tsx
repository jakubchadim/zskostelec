import React from 'react'
import { graphql, Link, PageProps } from 'gatsby'
import { ArrowBack } from '@styled-icons/material/ArrowBack'
import SimpleReactLightbox, {
  SRLWrapper,
  useLightbox
} from 'simple-react-lightbox'
import styled from 'styled-components'
import { navigate } from 'gatsby'
import Article from '../components/article/article'
import BlockList from '../components/block/list'
import { TransformedBlock } from '../components/block/types'
import { parseBlocks } from '../components/block/utils'
import Content from '../components/content/content'
import UiContainer from '../components/ui/container/container'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiGrid from '../components/ui/grid/grid'
import UiLinkBack from '../components/ui/link/back'
import UiLink from '../components/ui/link/link'
import UiSection from '../components/ui/section/section'
import { DateString, ID, RawHTML } from '../types'
import UiGalleryImage from '../components/ui/gallery/image'

type Gallery = {
  id: string
  title: string
  date: string
  link: string
  acf: {
    previews?: {
      source_url: string
      media_details?: {
        sizes?: {
          medium_large?: {
            source_url: string
          }
        }
      }
    }[]
  }
}

const GalleryMoreImg = styled.img`
  opacity: 0.5;
  filter: blur(2px);
`

const GalleryMoreLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0.8;
  transform: translateX(-50%) translateY(-50%);
  white-space: nowrap;
  font-size: 1.4rem;
`

type GalleryViewProps = {
  gallery: Gallery
}

export const GalleryView: React.FC<GalleryViewProps> = ({ gallery }) => {
  const { openLightbox } = useLightbox()

  const galleryImages = React.useMemo(() => {
    if (!gallery.acf?.previews) {
      return []
    }

    return gallery.acf?.previews.map((image) => {
      return {
        src: image.source_url,
        thumbnail:
          image.media_details?.sizes?.medium_large?.source_url ||
          image.source_url,
        width: 'auto',
        height: 'auto'
      }
    })
  }, [gallery.acf?.previews])

  return (
    <>
      <SRLWrapper images={galleryImages} />
      <UiGrid>
        {galleryImages.map((image, idx) => {
          const last = galleryImages.length === idx + 1

          return (
            <UiGrid.Item key={idx} xs={6} sm={3}>
              <UiGalleryImage
                onClick={
                  last ? () => navigate(gallery.link) : () => openLightbox(idx)
                }
              >
                {last ? (
                  <>
                    <GalleryMoreImg src={image.thumbnail} />
                    <GalleryMoreLabel>Více fotografií</GalleryMoreLabel>
                  </>
                ) : (
                  <img src={image.thumbnail} />
                )}
              </UiGalleryImage>
            </UiGrid.Item>
          )
        })}
      </UiGrid>
    </>
  )
}

type WordpressPostData = {
  wordpressCategory: {
    name: string
    link: string
  }
  wordpressPost: {
    title: string
    content: RawHTML
    date: DateString
    blocks: TransformedBlock[]
    galleries?: Gallery[]
  }
  allWordpressPost: {
    edges: {
      node: {
        id: ID
        date: DateString
        title: string
        excerpt: RawHTML
        link: string | null
      }
    }[]
  }
}

export const query = graphql`
  query currentPostQuery($id: String!, $categoryId: String!) {
    wordpressCategory(id: { eq: $categoryId }) {
      name
      link
    }
    wordpressPost(id: { eq: $id }) {
      title
      content
      date(formatString: "DD.MM. YYYY")
      blocks {
        blockId
        parentId
        type
        attrs
        content
      }
      galleries {
        acf {
          previews {
            id
            source_url
            caption
            media_details {
              sizes {
                medium_large {
                  source_url
                }
              }
            }
          }
        }
        link
        title
        date(formatString: "DD.MM. YYYY")
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

const HiddenSmDown = styled.div`
  display: none;

  ${(p) => p.theme.media.md.up} {
    display: block;
  }
`

type PostProps = PageProps<WordpressPostData>

const Post: React.FC<PostProps> = ({
  data: { wordpressCategory, wordpressPost, allWordpressPost }
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
              <UiLinkBack>
                <UiLink as={Link} to={wordpressCategory.link} secondary simple>
                  <UiLink.Icon as={ArrowBack} />
                  {wordpressCategory.name}
                </UiLink>
              </UiLinkBack>
              <div style={{ opacity: '.7' }}>{wordpressPost.date}</div>
              <h1 dangerouslySetInnerHTML={{ __html: wordpressPost.title }} />
              {parsedBlocks.length ? (
                <BlockList blocks={parsedBlocks} nested />
              ) : (
                <Content content={wordpressPost.content} />
              )}
              {!!wordpressPost.galleries?.length && (
                <div>
                  {wordpressPost.galleries
                    .filter(
                      (gallery) => (gallery.acf?.previews?.length || 0) > 0
                    )
                    .map((gallery) => (
                      <SimpleReactLightbox key={gallery.id}>
                        <GalleryView gallery={gallery} />
                      </SimpleReactLightbox>
                    ))}
                </div>
              )}
            </UiGrid.Item>
            <UiGrid.Item md={4}>
              <UiGrid>
                {allWordpressPost.edges.map(({ node: post }, idx) => {
                  const article = <Article post={post} />

                  return (
                    <UiGrid.Item md={12} sm={6} key={post.id}>
                      {idx < 2 ? (
                        article
                      ) : (
                        <HiddenSmDown>{article}</HiddenSmDown>
                      )}
                    </UiGrid.Item>
                  )
                })}
              </UiGrid>
            </UiGrid.Item>
          </UiGrid>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Post
