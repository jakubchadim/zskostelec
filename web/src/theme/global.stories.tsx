import React from 'react'
import { generateParagraph, generateWord } from '../utils/storiesUtils'

export default {
  title: 'Global'
}

export const Texts = () => (
  <>
    <h4>Regular text</h4>
    <p>{generateParagraph()}</p>
    <p>{generateParagraph()}</p>
    <h4>Link</h4>
    <a href='#'>{generateWord(3)}</a>
  </>
)

export const Titles = () => (
  <>
    <h1>H1 - Title 1</h1>
    <h2>H2 - Title 2</h2>
    <h3>H3 - Title 3</h3>
    <h4>H4 - Title 4</h4>
    <h5>H5 - Title 5</h5>
    <h6>H6 - Title 6</h6>
  </>
)
