import os from 'node:os'
import path from 'node:path'

function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

export const cleanUrl = (url: string): string => {
  const QUERY_RE = /\?.*$/s
  const HASH_RE = /#.*$/s
  return url.replace(HASH_RE, '').replace(QUERY_RE, '')
}

export function normalizePath(id: string): string {
  const isWindows = os.platform() === 'win32'
  return path.posix.normalize(isWindows ? slash(id) : id)
}
