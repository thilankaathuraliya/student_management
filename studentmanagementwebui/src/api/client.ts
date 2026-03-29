import { getApiBaseUrl } from '../config'

export const TOKEN_STORAGE_KEY = 'studentmanagement_jwt'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
  else localStorage.removeItem(TOKEN_STORAGE_KEY)
}

function buildUrl(path: string): string {
  const base = getApiBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

export async function apiFetch(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<Response> {
  const { skipAuth, ...rest } = init
  const token = skipAuth ? null : getStoredToken()
  const headers = new Headers(rest.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const body = rest.body
  if (
    body &&
    typeof body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(buildUrl(path), { ...rest, headers })
  if (res.status === 401 && !path.includes('/api/auth/login')) {
    setStoredToken(null)
    window.dispatchEvent(new CustomEvent('sm-unauthorized'))
  }
  return res
}

export async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) {
    if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`)
    return undefined as T
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(text || res.statusText)
  }
}

export async function getErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string }
    if (data?.message) return data.message
  } catch {
    /* ignore */
  }
  return res.statusText || `Request failed (${res.status})`
}
