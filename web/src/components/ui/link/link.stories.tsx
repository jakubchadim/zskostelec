import { boolean } from '@storybook/addon-knobs'
import React from 'react'
import { ArrowBack } from '@styled-icons/material/ArrowBack'
import UiLink from './link'

export default {
  title: 'Ui/Link'
}

export const Link = () => {
  const secondary = boolean('Secondary', true)

  return (
    <>
      <div>
        <h3>Link</h3>
        <UiLink secondary={secondary}>Simple link</UiLink>
      </div>
      <div>
        <h3>Link with icon</h3>
        <UiLink secondary={secondary}>
          <UiLink.Icon as={ArrowBack} />
          Link with icon
        </UiLink>
      </div>
    </>
  )
}
