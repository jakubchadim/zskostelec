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

type SpacingGetterSimple = (spacing: number) => string
type SpacingGetterSides = (
  topAndBottom: number,
  leftAndRight?: number
) => string
type SpacingGetterSidesAndBottom = (
  top: number,
  leftAndRight?: number,
  bottom?: number
) => string
type SpacingGetterFull = (
  top: number,
  right?: number,
  bottom?: number,
  left?: number
) => string
type SpacingGetter =
  | SpacingGetterSimple
  | SpacingGetterSides
  | SpacingGetterSidesAndBottom
  | SpacingGetterFull

export function getSpacingGetter(size: number, unit = 'rem'): SpacingGetter {
  return (...steps: (number | undefined)[]) =>
    steps
      .map((step) => {
        return step !== undefined && `${size * step}${unit}`
      })
      .filter((s) => s)
      .join(' ')
}
