import React from 'react'
import styled from 'styled-components'
import { BlockColor } from '../../block/color/color'
import UiGrid from '../grid/grid'
import UiShape from '../shape/shape'
import UiGallery from './gallery'

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

export default {
  title: 'Ui'
}

export const Gallery = () => (
  <Offset>
    <UiGrid>
      {images.map((image, idx) => (
        <UiGrid.Item key={idx} xs={6} sm={4}>
          <UiGallery>
            <UiGallery.Image>
              <img src={image.thumbnail} alt={image.caption} />
            </UiGallery.Image>
            <UiGallery.Overlay>
              <UiShape color={BlockColor.WHITE} />
              <UiGallery.Label>20. 12. 2017</UiGallery.Label>
              <UiGallery.Title>{image.caption}</UiGallery.Title>
            </UiGallery.Overlay>
          </UiGallery>
        </UiGrid.Item>
      ))}
    </UiGrid>
  </Offset>
)
