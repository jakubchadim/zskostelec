import React from 'react'
import styled from 'styled-components'
import { generateSentence, generateWord } from '../../../utils/storiesUtils'
import { BlockColor } from '../../block/color/color'
import { BlockCoreButtonType } from '../../block/core/button/constants'
import UiBox from '../box/box'
import UiButton from '../button/button'
import UiGrid from '../grid/grid'
import UiArticle from './article'

const Offset = styled.div`
  padding: 10rem;
`

const articles = [
  {
    title: generateSentence(),
    excerpt: `<p>${generateSentence(3)}</p>`
  },
  {
    title: generateSentence(2),
    excerpt: `<p>${generateSentence(4)}</p>`
  },
  {
    title: generateWord(3),
    excerpt: `<p>${generateSentence(1)}</p>`
  }
]

export default {
  title: 'Ui'
}

export const Article = () => (
  <Offset>
    <UiGrid largeGutter>
      {articles.map((article, idx) => (
        <UiGrid.Item key={idx} xs={6} sm={4}>
          <UiBox backgroundColor={BlockColor.MEDIUM_GRAY}>
            <UiBox.Header>
              <UiArticle.Header>
                <UiArticle.Title>{article.title}</UiArticle.Title>
              </UiArticle.Header>
            </UiBox.Header>
            <UiBox.Content>
              <UiArticle.Perex
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
              <UiButton
                themeType={BlockCoreButtonType.OUTLINE}
                backgroundColor={BlockColor.MEDIUM_GRAY}
                textColor={BlockColor.BLACK}
              >
                Více informací
              </UiButton>
            </UiBox.Content>
          </UiBox>
        </UiGrid.Item>
      ))}
    </UiGrid>
  </Offset>
)
