import { describe, expect, it } from 'vitest'
import { normalizeMenuTree } from './menu'

// Ported from web/src/components/nav/normalizer.test.ts, adapted to this
// module's flatten-then-rebuild approach, which must handle either raw
// shape wp-api-menus might return (see T1 plan risk #3).
describe('normalizeMenuTree', () => {
  it('rebuilds a tree from an already-flat list (items carrying `parent`)', () => {
    const flat = [
      { ID: 31, parent: 0, title: 'A', url: '/a/' },
      { ID: 30, parent: 0, title: 'B', url: '/b/' },
      { ID: 33, parent: 30, title: 'B.1', url: '/b/1/' },
      { ID: 40, parent: 33, title: 'B.1.1', url: '/b/1/1/' }
    ]

    const tree = normalizeMenuTree(flat)
    expect(tree).toHaveLength(2)

    const b = tree.find((item) => item.title === 'B')
    expect(b?.items).toHaveLength(1)
    expect(b?.items[0].items).toHaveLength(1)
    expect(b?.items[0].items[0].title).toBe('B.1.1')
  })

  it('flattens a nested response (items carrying `children`) before rebuilding, ending with the same 4 total items', () => {
    const nested = [
      { ID: 31, parent: 0, title: 'A', url: '/a/' },
      {
        ID: 30,
        parent: 0,
        title: 'B',
        url: '/b/',
        children: [{ ID: 33, parent: 30, title: 'B.1', url: '/b/1/', children: [{ ID: 40, parent: 33, title: 'B.1.1', url: '/b/1/1/' }] }]
      }
    ]

    const tree = normalizeMenuTree(nested)
    expect(tree).toHaveLength(2)

    const b = tree.find((item) => item.title === 'B')
    expect(b?.items[0].items[0].title).toBe('B.1.1')
  })

  it('defaults missing target/slug to empty strings', () => {
    const [item] = normalizeMenuTree([{ ID: 1, parent: 0, title: 'A', url: '/a/' }])
    expect(item.target).toBe('')
    expect(item.slug).toBe('')
  })
})
