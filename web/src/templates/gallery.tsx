import { graphql, Link, PageProps } from 'gatsby'
import { FixedObject } from 'gatsby-image'
import React from 'react'
import SimpleReactLightbox, {
  SRLWrapper,
  useLightbox
} from 'simple-react-lightbox'
import Img from 'gatsby-image'
import { ArrowBack } from '@styled-icons/material/ArrowBack'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import UiGrid from '../components/ui/grid/grid'
import UiGalleryImage from '../components/ui/gallery/image'
import UiLinkBack from '../components/ui/link/back'
import UiLink from '../components/ui/link/link'
import UiSection from '../components/ui/section/section'
import { Nullable } from '../types'

type GalleryImage = {
  id: string
  source_url: string
  caption: string
  localFile: {
    preview: Nullable<{
      fixed: FixedObject
    }>
    full: Nullable<{
      fluid: {
        src: string
        presentationHeight: number
        presentationWidth: number
      }
    }>
  }
}

type GalleryViewProps = {
  images: GalleryImage[]
}

const GalleryView: React.FC<GalleryViewProps> = ({ images }) => {
  const { openLightbox } = useLightbox()

  const galleryImages = React.useMemo(() => {
    return images.map((image) => {
      const full = image.localFile.full?.fluid

      return {
        src: full?.src || image.source_url,
        thumbnail: image.localFile.preview?.fixed.src || image.source_url,
        caption: image.caption,
        width: full?.presentationWidth || 'auto',
        height: full?.presentationHeight || 'auto'
      }
    })
  }, [images])

  return (
    <>
      <SRLWrapper images={galleryImages} />
      <UiGrid>
        {images.map((image, idx) => (
          <UiGrid.Item key={idx} xs={6} sm={4}>
            <UiGalleryImage onClick={() => openLightbox(idx)}>
              {image.localFile.preview ? (
                <Img fixed={image.localFile.preview.fixed} alt='' />
              ) : (
                <img src={image.source_url} />
              )}
            </UiGalleryImage>
          </UiGrid.Item>
        ))}
      </UiGrid>
    </>
  )
}

type WordpressGalleryData = {
  wordpressWpGallery: {
    title: string
    date: string
    acf: {
      preview: GalleryImage
      gallery: GalleryImage[]
    }
  }
}

export const query = graphql`
  query currentGalleryQuery($id: String!) {
    wordpressWpGallery(id: { eq: $id }) {
      title
      date(formatString: "DD.MM. YYYY")
      acf {
        gallery {
          id
          source_url
          caption
          localFile {
            full: childImageSharp {
              fluid(maxWidth: 1000, maxHeight: 700, fit: INSIDE, quality: 100) {
                src
              }
            }
            preview: childImageSharp {
              fixed(width: 400, height: 400, cropFocus: CENTER) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`

type GalleryProps = PageProps<WordpressGalleryData, { allGalleryLink?: string }>

const Gallery: React.FC<GalleryProps> = ({
  data: { wordpressWpGallery },
  pageContext
}) => {
  return (
    <Layout>
      <SEO title={wordpressWpGallery.title} />
      <UiSection>
        <UiContainer>
          {pageContext.allGalleryLink != null && (
            <UiLinkBack>
              <UiLink
                as={Link}
                to={pageContext.allGalleryLink}
                secondary
                simple
              >
                <UiLink.Icon as={ArrowBack} />
                Fotogalerie
              </UiLink>
            </UiLinkBack>
          )}
          <div style={{ opacity: '.7' }}>{wordpressWpGallery.date}</div>
          <h1>{wordpressWpGallery.title}</h1>
          <SimpleReactLightbox>
            <GalleryView images={wordpressWpGallery.acf.gallery} />
          </SimpleReactLightbox>
        </UiContainer>
      </UiSection>
    </Layout>
  )
}

export default Gallery
