import React from 'react'
import styled from 'styled-components'

const Title = styled.div`
  max-height: 3.3em;
  overflow: hidden;
`

const Header = styled.h3`
  height: 3.3em;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  font-weight: 700;
  margin-top: 0;
`

const Perex = styled.div`
  height: 2.8em;
  margin-bottom: ${(p) => p.theme.spacing(4)};
  overflow: hidden;

  p {
    margin: 0;
  }
`

export default {
  Header,
  Title,
  Perex
}
