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

export const generateParagraph = (num = 1) => {
  return lorem.generateParagraphs(num)
}

export const generateSentence = (num = 1) => {
  return lorem.generateSentences(num)
}

export const generateWord = (num = 1) => {
  return lorem.generateWords(num)
}
