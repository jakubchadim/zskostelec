import React from 'react'
import { StyledIcon } from '@styled-icons/styled-icon'
import UiIcon from '../ui/icon/icon'
import UiNonIdealState from '../ui/nonIdealState/nonIdealState'

type NonIdealStateProps = {
  icon: StyledIcon
  title: string
  description?: string
  children?: React.ReactNode
}

const NonIdealState: React.FC<NonIdealStateProps> = ({
  icon,
  title,
  description,
  children
}) => {
  return (
    <UiNonIdealState>
      <UiNonIdealState.Icon>
        <UiIcon icon={icon} size={46} />
      </UiNonIdealState.Icon>
      <h2>{title}</h2>
      {description != null && (
        <UiNonIdealState.Description>{description}</UiNonIdealState.Description>
      )}
      {children}
    </UiNonIdealState>
  )
}

export default NonIdealState
