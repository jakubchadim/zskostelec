import styled from 'styled-components'

const UiSectionOffset = styled.div`
  padding: ${(p) => p.theme.spacing(1, 0, 4)};

  ${(p) => p.theme.media.sm.up} {
    padding: ${(p) => p.theme.spacing(4, 0)};
  }

  ${(p) => p.theme.media.md.up} {
    padding: ${(p) => p.theme.spacing(8, 0, 4)};
  }
`

export default UiSectionOffset
