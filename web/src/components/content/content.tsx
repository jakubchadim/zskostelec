import { Link } from 'gatsby'
import React from 'react'
import parse, { DomElement, domToReact } from 'html-react-parser'
import { Nullable, RawHTML } from '../../types'
import ImagePost from '../image/post'

type LinkAttrs = {
  href?: string
  target?: string
}

type ImageAttrs = {
  src?: string
  alt?: string
  width?: string
}

const replaceMedia = (node: DomElement) => {
  if (node.name === 'img') {
    const attrs: ImageAttrs = node.attribs || {}

    if (!attrs.src) {
      return node
    }

    return <ImagePost src={attrs.src} alt={attrs.alt} width={attrs.width} />
  }
  if (node.name === 'a') {
    const attrs: LinkAttrs = node.attribs || {}

    if (
      !attrs.href ||
      attrs.href.startsWith('http') ||
      attrs.target === '_blank'
    ) {
      return node
    }

    return (
      <Link to={attrs.href} target={attrs.target}>
        {node.children && domToReact(node.children)}
      </Link>
    )
  }

  return node
}

type ContentProps = {
  content?: Nullable<RawHTML>
}

const Content: React.FC<ContentProps> = ({ content }) => (
  <>{content && parse(content, { replace: replaceMedia })}</>
)

export default React.memo(Content)
