import React from 'react'
import { LocationOn } from '@styled-icons/material-outlined/LocationOn'
import { Phone } from '@styled-icons/material/Phone'
import { Email } from '@styled-icons/material-outlined/Email'
import { Briefcase } from '@styled-icons/boxicons-regular/Briefcase'
import { BlockColor } from '../block/color/color'
import UiBox from '../ui/box/box'
import UiEmployee from '../ui/employee/employee'

function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length !== 9) {
    return phoneNumber
  }

  return `+420 ${phoneNumber.match(/.{1,3}/g)?.join(' ')}`
}

type EmployeeProps = {
  photo?: React.ReactNode
  name: string
  location?: string
  position?: string
  phone?: string
  email?: string
  offsetTop?: boolean
}

const Employee: React.FC<EmployeeProps> = ({
  photo,
  name,
  location,
  position,
  phone,
  email,
  offsetTop
}) => {
  return (
    <UiBox backgroundColor={BlockColor.WHITE} offsetTop={offsetTop}>
      <UiEmployee>
        <UiEmployee.Photo>{photo}</UiEmployee.Photo>
        <UiEmployee.Content>
          <UiEmployee.Name>{name}</UiEmployee.Name>
          {!!position && (
            <UiEmployee.ContentInfo>
              <UiEmployee.ContentIcon as={Briefcase} />
              {position}
            </UiEmployee.ContentInfo>
          )}
          {!!phone && (
            <UiEmployee.ContentInfo>
              <UiEmployee.ContentIcon as={Phone} />
              <a href={`tel:${phone}`}>{formatPhoneNumber(phone)}</a>
            </UiEmployee.ContentInfo>
          )}
          {!!email && (
            <UiEmployee.ContentInfo>
              <UiEmployee.ContentIcon as={Email} />
              <a href={`mailto:${email}`}>{email}</a>
            </UiEmployee.ContentInfo>
          )}
          {!!location && (
            <UiEmployee.ContentInfo>
              <UiEmployee.ContentIcon as={LocationOn} />
              {location}
            </UiEmployee.ContentInfo>
          )}
        </UiEmployee.Content>
      </UiEmployee>
    </UiBox>
  )
}

export default Employee
