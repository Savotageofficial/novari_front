import { API_BASE_URL } from './env'

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  token?: string | null
}

export function formatAuthHeader(token: string): string {
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

function getErrorMessage(status: number, payload: unknown): string {
  if (status === 401) {
    return 'Session expired. Please log in again.'
  }
  if (status === 404) {
    return 'Not found.'
  }
  if (
    status === 400 &&
    payload &&
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload
  ) {
    return String((payload as { error: unknown }).error)
  }
  if (
    payload &&
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload
  ) {
    return String((payload as { error: unknown }).error)
  }
  return `Request failed with status ${status}`
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, token, headers, ...init } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: formatAuthHeader(token) } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response.status, payload), response.status, payload)
  }

  return payload as T
}

export async function apiFormDataRequest<T>(
  path: string,
  fields: Record<string, string>,
  options: { method?: string; token?: string | null } = {}
): Promise<T> {
  const { method = 'POST', token } = options
  const formData = new FormData()

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: formatAuthHeader(token) } : {}),
    },
    body: formData,
  })

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response.status, payload), response.status, payload)
  }

  return payload as T
}

export async function apiUploadFile<T>(
  path: string,
  file: File,
  token: string,
  fields?: Record<string, string | number>
): Promise<T> {
  const formData = new FormData()
  formData.append('image', file)
  if (fields) {
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, String(value))
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: formatAuthHeader(token),
    },
    body: formData,
  })

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response.status, payload), response.status, payload)
  }

  return payload as T
}
