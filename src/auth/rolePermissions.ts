import axios from 'axios'
import type { ApiResponse, CurrentUserResponse } from '@/hooks/api/useAuth'
import { getAccessToken, getStoredCurrentUser, setStoredCurrentUser } from '@/auth/storage'

/** API roles — align with backend (Agent de scolarité = ADMIN). */
export type AppRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export function normalizeRole(role: string | null | undefined): AppRole | null {
  if (role === 'ADMIN' || role === 'TEACHER' || role === 'STUDENT') return role
  return null
}

export function getHomePathForRole(_role: AppRole): '/planning' {
  return '/planning'
}

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/** Routes under `/(app)` — students must never land here (handled in parent `beforeLoad`). */
export function isAllowedAppPath(role: AppRole, pathname: string): boolean {
  const p = normalizePathname(pathname)

  if (role === 'STUDENT') return false

  if (role === 'TEACHER') {
    return p === '/requests' || p.startsWith('/requests/')
  }

  if (role === 'ADMIN') {
    const prefixes = [
      '/teachers',
      '/scolarite',
      '/requests',
      '/modules',
      '/groupes',
      '/formations',
      '/sessions',
      '/buildings',
      '/availability',
      '/admin',
    ]
    return prefixes.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))
  }

  return false
}

/**
 * Resolves current user for route guards (storage first, then API).
 * Keeps localStorage in sync with the API when fetched.
 */
export async function getCurrentUserForGuard(): Promise<CurrentUserResponse | null> {
  const token = getAccessToken()
  if (!token) return null

  const cached = getStoredCurrentUser<CurrentUserResponse>()
  if (cached?.role) return cached

  try {
    const baseURL = import.meta.env.VITE_API_URL || 'https://hyper-planning.fr/api'
    const { data } = await axios.get<ApiResponse<CurrentUserResponse>>(
      `${baseURL}/Auth/current-user`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (data.result) setStoredCurrentUser(data.result)
    return data.result
  } catch {
    return null
  }
}

export type NavItemDef = {
  to: string
  label: string
  /** Which roles see this entry in the main navigator (STUDENT uses planning without this shell). */
  roles: AppRole[]
}

/** Single source of truth for sidebar labels + RBAC visibility. */
export const MAIN_NAV_ITEMS: NavItemDef[] = [
  { to: '/planning', label: 'Planning', roles: ['ADMIN', 'TEACHER'] },
  { to: '/teachers', label: 'Enseignants', roles: ['ADMIN'] },
  { to: '/groupes', label: 'Groupes', roles: ['ADMIN'] },
  { to: '/buildings', label: 'Bâtiments et salles', roles: ['ADMIN'] },
  { to: '/formations', label: 'Formations', roles: ['ADMIN'] },
  { to: '/sessions', label: 'Séances', roles: ['ADMIN'] },
  { to: '/modules', label: 'Modules', roles: ['ADMIN'] },
  { to: '/requests', label: 'Demandes', roles: ['ADMIN', 'TEACHER'] },
  { to: '/scolarite', label: 'Scolarité', roles: ['ADMIN'] },
  { to: '/availability', label: 'Disponibilités', roles: ['ADMIN'] },
  { to: '/admin/accounts', label: 'Comptes', roles: ['ADMIN'] },
]

export function navItemsForRole(role: AppRole | null): NavItemDef[] {
  if (!role) return []
  return MAIN_NAV_ITEMS.filter((item) => item.roles.includes(role))
}
