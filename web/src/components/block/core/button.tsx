import React from 'react'
import Content from '../../content/content'
import { BlockFC } from '../types'

const BlockCoreButton: BlockFC = ({ block }) => (
  <Content content={block.content} />
)

export default BlockCoreButton
