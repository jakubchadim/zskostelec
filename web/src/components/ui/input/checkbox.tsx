import React from 'react'
import styled from 'styled-components'
import { Check } from '@styled-icons/material/Check'

const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  cursor: pointer;
  opacity: 0;
`

const Checkbox = styled.span<{ offset: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.3em;
  height: 1.3em;
  min-width: 1.3em;
  border-radius: ${(p) => p.theme.radius.small};
  margin-right: ${(p) => (p.offset ? p.theme.spacing(2) : undefined)};
  box-shadow: inset 0 0 0 0.1rem ${(p) => p.theme.color.gray5};
  transition: box-shadow 0.2s;
  color: ${(p) => p.theme.color.white1};

  svg {
    width: 85%;
    opacity: 0;
    transition: opacity 0.2s;
  }

  ${Input}:checked + & {
    box-shadow: inset 0 0 0 1em ${(p) => p.theme.color.secondary1} !important;

    svg {
      opacity: 1;
    }
  }
`

const Label = styled.label<{ fill?: boolean }>`
  cursor: pointer;
  user-select: none;
  position: relative;
  display: ${(p) => (p.fill ? 'flex' : 'inline-flex')};
  align-items: center;
  vertical-align: middle;
  margin: ${(p) => p.theme.spacing(0, 0, 1)};

  &:hover,
  &:focus,
  &:active {
    ${Checkbox} {
      box-shadow: inset 0 0 0 0.2rem ${(p) => p.theme.color.secondary1};
    }
  }
`

type UiInputCheckboxProps = Omit<
  React.HTMLAttributes<HTMLInputElement>,
  'type'
> & {
  checked?: boolean
  label?: React.ReactNode
  fill?: boolean
}

const UiInputCheckbox: React.FC<UiInputCheckboxProps> = ({
  label,
  fill,
  ...input
}) => (
  <Label fill={fill}>
    <Input {...input} type='checkbox' />
    <Checkbox offset={label != null}>
      <Check />
    </Checkbox>
    {label}
  </Label>
)

export default UiInputCheckbox
