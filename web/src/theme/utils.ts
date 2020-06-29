'use strict'

import { Opaque } from '../types'

type MediaString = Opaque<'MediaString', string>

type BreakpointMedia = {
  up: MediaString
  down: MediaString
  only: MediaString
}

function pxToEm (pxSize: number): number {
  return pxSize / 16
}

const customMediaQueryMin = (minWidth: number) => <MediaString> `@media only screen and (min-width: ${pxToEm(minWidth)}em)`;
const customMediaQueryMax = (maxWidth: number) => <MediaString> `@media only screen and (max-width: ${pxToEm(maxWidth)}em)`;
const customMediaQueryOnly = (minWidth: number, maxWidth: number) => <MediaString> `@media only screen and (min-width: ${pxToEm(minWidth)}em) and and (max-width: ${pxToEm(maxWidth)}em)`;

export function getBreakpoint(minWidth: number, maxWidth: number): BreakpointMedia {
  return {
    up: customMediaQueryMin(minWidth),
    down: customMediaQueryMax(maxWidth),
    only: customMediaQueryOnly(minWidth, maxWidth)
  }
}

type SpacingGetter = (steps: number) => string

export function getSpacingGetter(size: number, unit: string = 'rem'): SpacingGetter {
  return (steps) => `${size * steps}${unit}`
}
