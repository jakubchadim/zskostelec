import 'styled-components'
import { Theme } from './theme/theme'

declare const graphql: (query: TemplateStringsArray) => void

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
