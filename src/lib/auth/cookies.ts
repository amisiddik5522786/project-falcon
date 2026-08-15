export const SESSION_COOKIE_NAME = '__Host-sb-session'

export function buildSetCookie(value: string, opts?: { maxAge?: number }) {
  const parts = []
  // __Host- cookies must be Secure and Path=/ and must not have Domain
  parts.push(`${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`)
  parts.push('Path=/')
  parts.push('HttpOnly')
  parts.push('Secure')
  parts.push('SameSite=Lax')
  if (opts?.maxAge != null) parts.push(`Max-Age=${Math.floor(opts.maxAge)}`)
  return parts.join('; ')
}

export function buildClearCookie() {
  // Set Max-Age=0 to clear the cookie
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

export function parseCookies(cookieHeader?: string | null) {
  const map: Record<string, string> = {}
  if (!cookieHeader) return map
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const k = part.slice(0, idx).trim()
    const v = part.slice(idx + 1).trim()
    map[k] = decodeURIComponent(v)
  }
  return map
}

export function parseJwtPayload(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')
    const b = Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    const str = b.toString('utf8')
    return JSON.parse(str)
  } catch (err) {
    return null
  }
}
