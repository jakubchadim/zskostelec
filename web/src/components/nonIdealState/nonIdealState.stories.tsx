import React from 'react'
import styled from 'styled-components'
import { FileEmpty } from '@styled-icons/icomoon/FileEmpty'
import { BlockColor } from '../block/color/color'
import UiButton from '../ui/button/button'
import NonIdealState from './nonIdealState'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'NonIdealState'
}

export const Base = () => (
  <Offset>
    <NonIdealState
      icon={FileEmpty}
      title='Soubory nenalezeny'
      description='Nalezeno 0 souborů. Zkuste hledat jinde.'
    >
      <UiButton
        backgroundColor={BlockColor.PRIMARY}
        textColor={BlockColor.WHITE}
      >
        Vyčistit filtr
      </UiButton>
    </NonIdealState>
  </Offset>
)
