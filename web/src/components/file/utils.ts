import { StyledIcon } from '@styled-icons/styled-icon'
import { FilePdf } from '@styled-icons/icomoon/FilePdf'
import { FileWord } from '@styled-icons/icomoon/FileWord'
import { FileExcel } from '@styled-icons/icomoon/FileExcel'
import { FileText2 } from '@styled-icons/icomoon/FileText2'
import { FilePicture } from '@styled-icons/icomoon/FilePicture'
import { FileMusic } from '@styled-icons/icomoon/FileMusic'
import { FileVideo } from '@styled-icons/icomoon/FileVideo'
import { FileZip } from '@styled-icons/icomoon/FileZip'
import { FileEmpty } from '@styled-icons/icomoon/FileEmpty'
import { FileExtension } from './constants'

const iconByExt: { [ext in FileExtension]: StyledIcon } = {
  [FileExtension.TXT]: FileText2,
  [FileExtension.PDF]: FilePdf,
  [FileExtension.DOC]: FileWord,
  [FileExtension.DOCX]: FileWord,
  [FileExtension.XLS]: FileExcel,
  [FileExtension.XLSX]: FileExcel,
  [FileExtension.PPT]: FileExcel,
  [FileExtension.PPTX]: FileExcel,
  [FileExtension.RAR]: FileZip,
  [FileExtension.ZIP]: FileZip,
  [FileExtension.MP3]: FileMusic,
  [FileExtension.WAV]: FileMusic,
  [FileExtension.JPG]: FilePicture,
  [FileExtension.JPEG]: FilePicture,
  [FileExtension.PNG]: FilePicture,
  [FileExtension.MP4]: FileVideo,
  [FileExtension.AVI]: FileVideo
}

export function getFileIcon(extension: string): StyledIcon {
  return iconByExt[<FileExtension>extension.toLowerCase()] || FileEmpty
}
