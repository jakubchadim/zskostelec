'use strict'

import { Opaque } from '../types'

type MediaString = Opaque<'MediaString', string>

type BreakpointMedia = {
  up: MediaString
  down: MediaString
  only: MediaString
}

function pxToEm(pxSize: number): number {
  return pxSize / 16
}

function customMediaQueryMin(minWidth: number): MediaString {
  return <MediaString>(
    `@media only screen and (min-width: ${pxToEm(minWidth)}em)`
  )
}

function customMediaQueryMax(maxWidth: number): MediaString {
  return <MediaString>(
    `@media only screen and (max-width: ${pxToEm(maxWidth)}em)`
  )
}

function customMediaQueryOnly(minWidth: number, maxWidth: number): MediaString {
  return <MediaString>(
    `@media only screen and (min-width: ${pxToEm(
      minWidth
    )}em) and and (max-width: ${pxToEm(maxWidth)}em)`
  )
}

export function getBreakpoint(
  minWidth: number,
  maxWidth: number
): BreakpointMedia {
  return {
    up: customMediaQueryMin(minWidth),
    down: customMediaQueryMax(maxWidth),
    only: customMediaQueryOnly(minWidth, maxWidth)
  }
}

type SpacingGetter = (steps: number) => string

export function getSpacingGetter(size: number, unit = 'rem'): SpacingGetter {
  return (steps) => `${size * steps}${unit}`
}
