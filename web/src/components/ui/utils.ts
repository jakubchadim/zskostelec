import React from 'react'

type ElementsObject = { [key: string]: React.FC }
type UiComponent<Component, Elements extends ElementsObject> = Component &
  Elements

// Create main component with subcomponents eg. Nav, Nav.Inner
export function createUiComponent<
  Component extends React.FC,
  Elements extends ElementsObject
>(component: Component, elements: Elements): UiComponent<Component, Elements> {
  const componentWithElements = <any>component

  for (const key of Object.keys(elements)) {
    if (!Object.prototype.hasOwnProperty.call(componentWithElements, key)) {
      componentWithElements[key] = elements[key]
    }
  }

  return <UiComponent<Component, Elements>>componentWithElements
}
