import React from 'react'
import styled from 'styled-components'
import { LocationOn } from '@styled-icons/material-outlined/LocationOn'
import { Phone } from '@styled-icons/material/Phone'
import { Email } from '@styled-icons/material-outlined/Email'
import { Briefcase } from '@styled-icons/boxicons-regular/Briefcase'
import logoImage from '../../../images/logo.svg'
import { BlockColor } from '../../block/color/color'
import UiBox from '../box/box'
import UiEmployee from './employee'

const Offset = styled.div`
  padding: 10rem;
`

export default {
  title: 'Ui'
}

export const Employee = () => (
  <Offset>
    <UiBox backgroundColor={BlockColor.WHITE}>
      <UiEmployee>
        <UiEmployee.Photo>
          <img src={logoImage} />
        </UiEmployee.Photo>
        <UiEmployee.Content>
          <UiEmployee.Name>Karel Novák</UiEmployee.Name>
          <UiEmployee.ContentInfo>
            <UiEmployee.ContentIcon as={LocationOn} />
            Náměstí
          </UiEmployee.ContentInfo>
          <UiEmployee.ContentInfo>
            <UiEmployee.ContentIcon as={Briefcase} />
            Učitel
          </UiEmployee.ContentInfo>
          <UiEmployee.ContentInfo>
            <UiEmployee.ContentIcon as={Phone} />
            777 632 532
          </UiEmployee.ContentInfo>
          <UiEmployee.ContentInfo>
            <UiEmployee.ContentIcon as={Email} />
            karel@novak.cz
          </UiEmployee.ContentInfo>
        </UiEmployee.Content>
      </UiEmployee>
    </UiBox>
  </Offset>
)
