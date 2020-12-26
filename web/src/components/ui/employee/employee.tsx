import styled from 'styled-components'
import { createUiComponent } from '../utils'

const UiEmployee = styled.div`
  display: flex;
  align-items: stretch;
  overflow: hidden;
  border-radius: ${(p) => p.theme.radius.small};
  padding: ${(p) => p.theme.spacing(2)};

  ${(p) => p.theme.media.xs.down} {
    display: block;
  }

  &::after {
    display: block;
    content: ' ';
    clear: both;
  }
`

const Photo = styled.div`
  display: none;
  width: 20rem;
  min-width: 20rem;
  background: ${(p) => p.theme.color.gray2};
  min-height: 20rem;
  border-radius: ${(p) => p.theme.radius.small};
  overflow: hidden;

  .gatsby-image-wrapper,
  img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }

  ${(p) => p.theme.media.xs.up} {
    display: block;
  }

  ${(p) => p.theme.media.xs.down} {
    float: right;
    width: 14rem;
    min-width: 14rem;
    min-height: 16rem;
    margin: ${(p) => p.theme.spacing(0, 0, 2, 2)};
  }
`

const Content = styled.div`
  flex-grow: 1;
  padding: ${(p) => p.theme.spacing(1, 1, 1, 4)};
`

const ContentInfo = styled.div`
  position: relative;
  padding: ${(p) => p.theme.spacing(1, 0, 1, 8)};
  font-size: 1.4rem;

  & + & {
    margin-top: ${(p) => p.theme.spacing(3)};
  }
`

const ContentIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -1.4rem;
  height: 2.6rem;
`

const Name = styled.h2`
  font-size: 2.5rem;
  margin: ${(p) => p.theme.spacing(0, 0, 3)};
  color: ${(p) => p.theme.color.primary2};
};
`

export default createUiComponent(UiEmployee, {
  Photo,
  Content,
  Name,
  ContentInfo,
  ContentIcon
})
