import React from 'react'
import Img from 'gatsby-image'
import { useImagePostQuery } from './post.query'

type ImagePostProps = {
  src: string
  alt?: string
  width?: string
}

// Remove sizes from src (eg. 1024-600)
function clearSrc(src: string): string {
  return src.replace(/^(.+?\/.+?)-(\d+x\d+)\.(.+?)$/g, '$1.$3')
}

const ImagePost: React.FC<ImagePostProps> = ({ src, alt, width }) => {
  const { allWordpressWpMedia } = useImagePostQuery()
  const originalSource = clearSrc(src)
  const image = allWordpressWpMedia.edges.find(
    ({ node }) => node.source_url === originalSource
  )

  if (image == null || image.node.localFile.childImageSharp == null) {
    return <img src={src} alt={alt} style={{ width: width ? width : '100%' }} />
  }

  return (
    <Img
      fluid={image.node.localFile.childImageSharp.fluid}
      alt={alt}
      style={{
        width: width ? width + 'px' : '100%',
        maxWidth: '100%'
      }}
    />
  )
}

export default ImagePost
