import navNormalizer from './normalizer'

const entities: any = [
  {
    items: [
      {
        wordpress_id: 31,
        wordpress_children: null
      },
      {
        wordpress_id: 30,
        wordpress_children: [
          {
            wordpress_id: 33,
            wordpress_children: [
              {
                wordpress_id: 40
              }
            ]
          }
        ]
      }
    ],
    __type: 'wordpress__wp_api_menus_menus_items'
  }
]

describe('Normalizer', () => {
  it('nav', () => {
    expect(navNormalizer({ entities })[0].items.length).toBe(4)
  })
})
