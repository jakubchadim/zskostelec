import { File, FileArchive, FileAudio, FileImage, FileSpreadsheet, FileText, FileVideo } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { getFileIcon } from './file-icon'

describe('getFileIcon', () => {
  it.each([
    ['txt', FileText],
    ['pdf', FileText],
    ['doc', FileText],
    ['docx', FileText],
    ['ppt', FileText],
    ['pptx', FileText],
    ['xls', FileSpreadsheet],
    ['xlsx', FileSpreadsheet],
    ['rar', FileArchive],
    ['zip', FileArchive],
    ['mp3', FileAudio],
    ['wav', FileAudio],
    ['jpg', FileImage],
    ['jpeg', FileImage],
    ['png', FileImage],
    ['mp4', FileVideo],
    ['avi', FileVideo]
  ])('maps .%s to the expected icon', (extension, icon) => {
    expect(getFileIcon(extension)).toBe(icon)
  })

  it('is case-insensitive', () => {
    expect(getFileIcon('PDF')).toBe(FileText)
  })

  it('falls back to the generic File icon for an unknown extension', () => {
    expect(getFileIcon('exe')).toBe(File)
  })

  it('falls back to the generic File icon when no extension is given', () => {
    expect(getFileIcon(undefined)).toBe(File)
    expect(getFileIcon('')).toBe(File)
  })
})
