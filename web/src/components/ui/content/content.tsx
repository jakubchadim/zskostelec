import styled from 'styled-components'

const UiContent = styled.div<{ largeGutter?: boolean; smallGutter?: boolean }>`
  margin: ${(p) =>
    p.theme.spacing(0, 0, p.largeGutter ? 4 : p.smallGutter ? 1 : 2)};
`

export default UiContent
