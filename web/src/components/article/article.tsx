import { Link } from 'gatsby'
import React from 'react'
import { getExternalLinkTarget } from '../../utils/link'
import { BlockColor } from '../block/color/color'
import { BlockCoreButtonType } from '../block/core/button/constants'
import UiBox from '../ui/box/box'
import UiArticle from '../ui/article/article'
import UiButton from '../ui/button/button'

type ArticleProps = {
  post: {
    title: string
    excerpt: string
    link: string
    date: string
  }
}

const Article: React.FC<ArticleProps> = ({ post }) => (
  <UiBox backgroundColor={BlockColor.WHITE}>
    <UiBox.Header>
      <UiArticle.Header>
        <UiArticle.Title dangerouslySetInnerHTML={{ __html: post.title }} />
      </UiArticle.Header>
    </UiBox.Header>
    <UiBox.Content>
      <UiArticle.Perex dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      <UiArticle.Footer>
        <UiButton
          as={Link}
          to={post.link}
          target={getExternalLinkTarget(post.link)}
          themeType={BlockCoreButtonType.OUTLINE}
          backgroundColor={BlockColor.WHITE}
          textColor={BlockColor.BLACK}
        >
          Zobrazit
        </UiButton>
        <UiArticle.Date>{post.date}</UiArticle.Date>
      </UiArticle.Footer>
    </UiBox.Content>
  </UiBox>
)

export default React.memo(Article)
