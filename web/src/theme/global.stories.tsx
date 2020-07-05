import React from 'react'
import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

export default {
  title: 'Global'
}

export const Texts = () => (
  <>
    <h4>Regular text</h4>
    <p>{lorem.generateSentences(5)}</p>
    <p>{lorem.generateSentences(3)}</p>
    <h4>Link</h4>
    <a href='#'>{lorem.generateWords(1)}</a>
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
