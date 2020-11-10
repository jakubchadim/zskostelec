import styled from 'styled-components'
import { createUiComponent } from '../utils'

const Image = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 80%;
  overflow: hidden;
  background: ${(p) => p.theme.color.gray3};

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

const UiGallery = styled.div`
  position: relative;
  background: ${(p) => p.theme.color.white1};
  border-radius: ${(p) => p.theme.radius.medium};
  box-shadow: ${(p) => p.theme.shadow.small};
  overflow: hidden;
  cursor: pointer;
  padding-bottom: ${(p) => p.theme.spacing(17)};

  &:hover {
    box-shadow: ${(p) => p.theme.shadow.lift};
    color: ${(p) => p.theme.color.black1};

    ${Image} {
      & > img,
      .gatsby-image-wrapper {
        transform: scale(1.1);
      }
    }
  }
`

const Label = styled.div`
  padding: ${(p) => p.theme.spacing(5, 5, 1)};
  font-size: ${(p) => p.theme.fontSize.text2};
  opacity: 0.7;
`

const Title = styled.h4`
  background: ${(p) => p.theme.color.white1};
  margin: 0;
  padding: ${(p) => p.theme.spacing(0, 5, 5)};
`

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(p) => p.theme.color.white1};
`

export default createUiComponent(UiGallery, {
  Image,
  Label,
  Title,
  Overlay
})
