import 'styled-components'
import { Theme } from './theme/theme'

declare const graphql: (query: TemplateStringsArray) => void

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {} // eslint-disable-line
}

declare module '*.png' {
  const content: string

  export = content
}

declare module '*.svg' {
  const content: string

  export = content
}
