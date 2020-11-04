// Remove sizes from src (eg. 1024-600)
export function clearSrc(src: string): string {
  return src.replace(/^(.+?\/.+?)-(\d+x\d+)\.(.+?)$/g, '$1.$3')
}
