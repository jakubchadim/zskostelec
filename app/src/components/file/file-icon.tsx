import { File, FileArchive, FileAudio, FileImage, FileSpreadsheet, FileText, FileVideo, type LucideIcon } from 'lucide-react'

/**
 * Extension -> icon map, port of web/src/components/file/{constants,utils}.ts
 * `FileExtension`/`getFileIcon` onto lucide-react (no styled-icons equivalent
 * available here). Document-like formats (txt/pdf/doc(x)/ppt(x)) share one
 * generic "text file" icon - lucide has no distinct pdf/word/ppt icon, unlike
 * the legacy @styled-icons/icomoon set.
 */
const ICON_BY_EXTENSION: Record<string, LucideIcon> = {
  txt: FileText,
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  ppt: FileText,
  pptx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  rar: FileArchive,
  zip: FileArchive,
  mp3: FileAudio,
  wav: FileAudio,
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
  mp4: FileVideo,
  avi: FileVideo
}

/** Case-insensitive; falls back to the generic `File` icon for an unknown/missing extension. */
export function getFileIcon(extension?: string): LucideIcon {
  if (!extension) {
    return File
  }

  return ICON_BY_EXTENSION[extension.toLowerCase()] ?? File
}
