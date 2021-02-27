import React from 'react'
import { BlockColor } from '../block/color/color'
import UiIcon from '../ui/icon/icon'
import UiFile from '../ui/file/file'
import UiButton from '../ui/button/button'
import { getFileIcon } from './utils'

type FileProps = {
  name: string
  href?: string
}

const File: React.FC<FileProps> = ({ name, href }) => {
  const extension = href?.split('.').pop()

  return (
    <UiFile>
      <UiFile.Icon>
        <UiIcon icon={getFileIcon(extension)} size={34} />
      </UiFile.Icon>
      <UiFile.Name>{name}</UiFile.Name>
      {extension != null && <UiFile.Ext>.{extension}</UiFile.Ext>}
      {href != null && (
        <UiFile.Button>
          <UiButton
            as='a'
            href={href}
            target='_blank'
            backgroundColor={BlockColor.PRIMARY}
            textColor={BlockColor.WHITE}
          >
            Stáhnout
          </UiButton>
        </UiFile.Button>
      )}
    </UiFile>
  )
}
export default React.memo(File)
