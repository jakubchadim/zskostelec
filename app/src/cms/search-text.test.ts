import { describe, expect, it } from 'vitest'
import { fold, searchTextOf } from './search-text'

const paragraph = (text: string) => ({
  root: {
    type: 'root',
    version: 1,
    direction: null,
    format: '',
    indent: 0,
    children: [
      {
        type: 'paragraph',
        version: 1,
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 }]
      }
    ]
  }
})

describe('searchTextOf', () => {
  it('joins title, perex and article text, folded for diacritics-free matching', () => {
    expect(searchTextOf({ title: 'Výlet do Prahy', excerpt: 'Šesťáci v ZOO', content: paragraph('Viděli jsme žirafy.') })).toBe(
      'vylet do prahy sestaci v zoo videli jsme zirafy.'
    )
  })

  it('skips what is missing (a gallery has only a title)', () => {
    expect(searchTextOf({ title: 'Školní zahrada 2025' })).toBe('skolni zahrada 2025')
    expect(searchTextOf({ title: 'Den dětí', excerpt: null, content: 'not lexical' })).toBe('den deti')
  })
})

describe('fold', () => {
  it('lowers case, drops diacritics and squeezes whitespace', () => {
    expect(fold('  Příliš   ŽLUŤOUČKÝ kůň ')).toBe('prilis zlutoucky kun')
  })
})
