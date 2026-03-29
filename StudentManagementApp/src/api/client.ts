import { getApiBaseUrl } from "../config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = RequestInit & { token?: string | null };

export async function apiFetch(
  path: string,
  { token, headers, ...init }: FetchOptions = {}
): Promise<Response> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const h = new Headers(headers);
  if (!h.has("Content-Type") && init.body != null) {
    h.set("Content-Type", "application/json");
  }
  if (token) {
    h.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers: h });
  return res;
}

export async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let msg = text || res.statusText || "Request failed";
    try {
      const j = JSON.parse(text) as { message?: string };
      if (typeof j?.message === "string" && j.message.length > 0) {
        msg = j.message;
      }
    } catch {
      /* use msg as-is */
    }
    throw new ApiError(msg, res.status, text);
  }
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}
