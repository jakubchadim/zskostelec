import React from 'react'

type ImagePostProps = {
  src: string
  alt?: string
  width?: string
}

const ImagePost: React.FC<ImagePostProps> = ({ src, alt, width }) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: width ? width + 'px' : '100%',
        maxWidth: '100%'
      }}
    />
  )
}

export default ImagePost
