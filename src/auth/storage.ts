export const ACCESS_TOKEN_KEY = 'accessToken'
export const EXPIRES_IN_KEY = 'expiresIn'
export const CURRENT_USER_KEY = 'currentUser'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setSession(token: string, expiresIn: number) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  localStorage.setItem(EXPIRES_IN_KEY, String(expiresIn))
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(EXPIRES_IN_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function setStoredCurrentUser(user: unknown) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function getStoredCurrentUser<T>(): T | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

