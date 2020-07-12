import styled from 'styled-components'

const UiContainer = styled.div<{ fluid?: boolean }>`
  max-width: ${(p) => (p.fluid ? '100%' : '100rem')};
  margin: 0 auto;
  padding: 0 ${(p) => p.theme.spacing(2)};
`

export default UiContainer
