import React from 'react'
import styled from 'styled-components'
import { generateParagraph } from '../../../utils/storiesUtils'
import { BlockColor } from '../../block/color/color'
import { getFileIcon } from '../../file/utils'

import UiBox from '../box/box'
import UiButton from '../button/button'
import UiGrid from '../grid/grid'
import UiIcon from '../icon/icon'
import UiFile from './file'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Ui'
}

const firstParagraph = generateParagraph()

export const File = () => (
  <Offset>
    <UiBox backgroundColor={BlockColor.WHITE}>
      <UiFile>
        <UiFile.Icon>
          <UiIcon icon={getFileIcon('jpg')} size={34} />
        </UiFile.Icon>
        <UiFile.Name>Testing image</UiFile.Name>
        <UiFile.Ext>.jpg</UiFile.Ext>
        <UiFile.Button>
          <UiButton
            backgroundColor={BlockColor.PRIMARY}
            textColor={BlockColor.WHITE}
          >
            Stáhnout
          </UiButton>
        </UiFile.Button>
      </UiFile>
    </UiBox>
    <UiBox backgroundColor={BlockColor.WHITE} offsetTop>
      <UiFile>
        <UiFile.Icon>
          <UiIcon icon={getFileIcon('jpg')} size={34} />
        </UiFile.Icon>
        <UiFile.Name>Testing image</UiFile.Name>
        <UiFile.Ext>.jpg</UiFile.Ext>
        <UiFile.Button>
          <UiButton
            backgroundColor={BlockColor.PRIMARY}
            textColor={BlockColor.WHITE}
          >
            Stáhnout
          </UiButton>
        </UiFile.Button>
      </UiFile>
    </UiBox>
  </Offset>
)
