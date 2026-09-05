// `@types/jsdom` isn't installed. This is a minimal ambient declaration
// covering only the single static method this data layer uses -
// `JSDOM.fragment()`, which returns a real DOM `DocumentFragment`
// (already typed via tsconfig's `"lib": ["dom", ...]`).
declare module 'jsdom' {
  export class JSDOM {
    static fragment(html: string): DocumentFragment
  }
}
