import React from 'react'
import styled from 'styled-components'

const UiGalleryImage = styled.div`
  position: relative;
  background: ${(p) => p.theme.color.gray3};
  box-shadow: ${(p) => p.theme.shadow.small};
  border-radius: ${(p) => p.theme.radius.medium};
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    box-shadow: ${(p) => p.theme.shadow.lift};

    & > img,
    .gatsby-image-wrapper {
      transform: scale(1.1);
    }
  }

  & > img,
  .gatsby-image-wrapper {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    transition: transform 0.2s ease-in-out;
  }
`

export default UiGalleryImage
