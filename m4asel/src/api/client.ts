import { env } from "@/src/config/env";
import { supabase } from "@/src/config/supabase";

/**
 * The single HTTP client for the app. Every feature service calls this instead
 * of hand-rolling `fetch` + `getIdToken()` + Bearer headers + error parsing.
 *
 *   apiClient.get<T>(path, options?)
 *   apiClient.post<T>(path, body?, options?)   // put / patch likewise
 *   apiClient.delete<T>(path, options?)
 *
 * Auth token is attached automatically from the current Supabase session. Pass
 * `{ authenticated: false }` for public endpoints (e.g. nearby washers).
 */

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions {
  /** Attach the Supabase access token as a Bearer header. Default: true. */
  authenticated?: boolean;
  /** Query-string params appended to the path (null/undefined dropped). */
  query?: QueryParams;
  signal?: AbortSignal;
}

/** Error thrown for any non-2xx response, carrying the HTTP status + raw detail. */
export class ApiError extends Error {
  readonly status: number;
  readonly detail: unknown;
  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

interface FastApiValidationItem {
  loc?: (string | number)[];
  msg?: string;
}

function buildUrl(path: string, query?: QueryParams): string {
  const base = `${env.apiBaseUrl}${path}`;
  if (!query) return base;
  const search = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return search ? `${base}?${search}` : base;
}

async function authHeader(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

/** Normalize a failed response into an ApiError, decoding FastAPI's `{ detail }`. */
async function toApiError(response: Response): Promise<ApiError> {
  let detail: unknown;
  let message = `Request failed (${response.status})`;
  try {
    const data = await response.json();
    detail = data?.detail;
    if (Array.isArray(detail)) {
      message = (detail as FastApiValidationItem[])
        .map((e) => `${e.loc?.join(".") ?? ""} — ${e.msg ?? ""}`.trim())
        .join("\n");
    } else if (typeof detail === "string") {
      message = detail;
    } else if (typeof data?.message === "string") {
      message = data.message;
    }
  } catch {
    // Body was empty or not JSON — keep the default status message.
  }
  return new ApiError(message, response.status, detail);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options?.authenticated !== false) {
    Object.assign(headers, await authHeader());
  }

  const url = buildUrl(path, options?.query);
  if (__DEV__) {
    console.log(`[api] → ${method} ${url}`, {
      authenticated: options?.authenticated !== false,
      hasToken: !!headers.Authorization,
      body,
    });
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: options?.signal,
    });
  } catch (networkError) {
    if (__DEV__) console.error(`[api] ✗ ${method} ${url} — network/fetch failed`, networkError);
    throw networkError;
  }

  if (__DEV__) console.log(`[api] ← ${method} ${url} — ${response.status}`);

  if (!response.ok) {
    const error = await toApiError(response);
    if (__DEV__) {
      console.error(`[api] ✗ ${method} ${url} — ${response.status}`, {
        message: error.message,
        detail: error.detail,
      });
    }
    throw error;
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
