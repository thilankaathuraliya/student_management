/**
 * When unset, requests use relative `/api/...` and the Vite dev server proxies to the API.
 * Set `VITE_API_BASE_URL` (e.g. `http://localhost:5048`) if you call the API directly without the proxy (requires CORS on the API).
 */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return ''
}
