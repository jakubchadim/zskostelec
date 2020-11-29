'use strict'

type DictionaryItem = {
  id: string
  name: string
}

export function getDictionaryTranslator(
  dictionary: DictionaryItem[]
): (id: string) => string {
  const data = Object.fromEntries(dictionary.map(({ id, name }) => [id, name]))

  return (id) => data[id]
}
