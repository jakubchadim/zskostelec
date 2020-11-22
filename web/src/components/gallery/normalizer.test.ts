import galleryNormalizer from './normalizer'

function generateAcfObject(preview?: string, gallery?: string[]): any {
  const result: any = {}

  if (preview == null) {
    result.preview = false
  } else {
    result.preview___NODE = preview
  }

  if (gallery == null) {
    result.gallery = false
  } else {
    result.gallery___NODE = gallery
  }

  return result
}

function getData(preview?: string, gallery?: string[]): any {
  return [
    {
      acf: generateAcfObject(preview, gallery),
      __type: 'wordpress__wp_gallery'
    }
  ]
}

describe('Normalizer', () => {
  it('gallery', () => {
    const empty = galleryNormalizer({ entities: getData() })[0]
    const emptyGallery = galleryNormalizer({
      entities: getData(undefined, [])
    })[0]
    const defaultImage = galleryNormalizer({
      entities: getData(undefined, ['image1'])
    })[0]
    const validGallery = galleryNormalizer({
      entities: getData('image1', ['image2'])
    })[0]

    expect(empty.acf).toEqual(generateAcfObject(undefined, undefined))
    expect(emptyGallery.acf).toEqual(generateAcfObject(undefined, []))
    expect(defaultImage.acf).toEqual(generateAcfObject('image1', ['image1']))
    expect(validGallery.acf).toEqual(generateAcfObject('image1', ['image2']))
  })
})
