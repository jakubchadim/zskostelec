import { graphql, Link, PageProps } from 'gatsby'
import React from 'react'
import SimpleReactLightbox, {
  SRLWrapper,
  useLightbox
} from 'simple-react-lightbox'
import { ArrowBack } from '@styled-icons/material/ArrowBack'
import Layout from '../components/layout/layout'
import SEO from '../components/seo/seo'
import UiContainer from '../components/ui/container/container'
import UiGrid from '../components/ui/grid/grid'
import UiGalleryImage from '../components/ui/gallery/image'
import UiLinkBack from '../components/ui/link/back'
import UiLink from '../components/ui/link/link'
import UiSection from '../components/ui/section/section'

type GalleryImage = {
  id: string
  source_url: string
  caption: string
  media_details?: {
    sizes?: {
      medium?: {
        source_url: string
      }
    }
  }
}

type GalleryViewProps = {
  images: GalleryImage[]
}

const GalleryView: React.FC<GalleryViewProps> = ({ images }) => {
  const { openLightbox } = useLightbox()

  const galleryImages = React.useMemo(() => {
    return images.map((image) => {
      return {
        src: image.source_url,
        thumbnail:
          image.media_details?.sizes?.medium?.source_url || image.source_url,
        caption: image.caption,
        width: 'auto',
        height: 'auto'
      }
    })
  }, [images])

  return (
    <>
      <SRLWrapper images={galleryImages} />
      <UiGrid>
        {galleryImages.map((image, idx) => (
          <UiGrid.Item key={idx} xs={6} sm={4}>
            <UiGalleryImage onClick={() => openLightbox(idx)}>
              <img src={image.thumbnail} />
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
          media_details {
            sizes {
              medium {
                source_url
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
