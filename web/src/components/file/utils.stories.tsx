import React from 'react'
import styled from 'styled-components'
import UiIcon from '../ui/icon/icon'
import { FileExtension } from './constants'
import { getFileIcon } from './utils'

const ExtTd = styled.td`
  vertical-align: middle;
  padding-left: 2rem;
`

export default {
  title: 'File/Utils'
}

export const Icon = () => (
  <table>
    <tr>
      <td>Icon</td>
      <ExtTd>Extension</ExtTd>
    </tr>
    {Object.values(FileExtension).map((ext) => (
      <tr key={ext}>
        <td>
          <UiIcon icon={getFileIcon(ext)} />
        </td>
        <ExtTd>{ext}</ExtTd>
      </tr>
    ))}
  </table>
)
