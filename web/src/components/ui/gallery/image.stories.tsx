import React from 'react'
import styled from 'styled-components'
import SimpleReactLightbox, {
  SRLWrapper,
  useLightbox
} from 'simple-react-lightbox'
import UiGrid from '../grid/grid'
import UiGalleryImage from './image'

const Offset = styled.div`
  padding: 10rem;
`

const images = [
  {
    src: 'https://www.simple-react-lightbox.dev/docs/gallery/unsplash18.jpg',
    thumbnail:
      'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash18.jpg',
    caption: 'Lorem ipsum dolor sit amet'
  },
  {
    src: 'https://www.simple-react-lightbox.dev/docs/gallery/unsplash19.jpg',
    thumbnail:
      'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash19.jpg',
    caption: 'Consecutur adiscip elit'
  },
  {
    src: 'https://www.simple-react-lightbox.dev/docs/gallery/unsplash20.jpg',
    thumbnail:
      'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash20.jpg',
    caption: 'Commodo commodo dolore'
  },
  {
    src: 'https://www.simple-react-lightbox.dev/docs/gallery/unsplash21.jpg',
    thumbnail:
      'https://www.simple-react-lightbox.dev/docs/gallery/thumbnails/unsplash21.jpg',
    caption: 'Deserunt deserunt commodo excepteur'
  }
]

const Gallery = () => {
  const { openLightbox } = useLightbox()

  return (
    <>
      <SRLWrapper images={images} />
      <UiGrid>
        {images.map((image, idx) => (
          <UiGrid.Item key={idx} xs={6} sm={4}>
            <UiGalleryImage onClick={() => openLightbox(idx)}>
              <img src={image.thumbnail} alt={image.caption} />
            </UiGalleryImage>
          </UiGrid.Item>
        ))}
      </UiGrid>
    </>
  )
}

export default {
  title: 'Ui'
}

export const GalleryImage = () => (
  <SimpleReactLightbox>
    <Offset>
      <Gallery />
    </Offset>
  </SimpleReactLightbox>
)
