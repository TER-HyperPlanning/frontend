import { useCurrentUser } from '@/hooks/api/useAuth'
import type { UserRole } from '@/hooks/api/mock/sessionApi'

export function useUserRole(): UserRole {
  const { data: currentUser } = useCurrentUser()

  if (!currentUser?.role) {
    return null
  }

  const role = String(currentUser.role).toLowerCase()

  if (role === 'enseignant' || role === 'teacher') {
    return 'enseignant'
  }

  if (
    role === 'admin' ||
    role === 'scolarité' ||
    role === 'scolarite'
  ) {
    return 'admin'
  }

  return null
}

export function useIsTeacher(): boolean {
  return useUserRole() === 'enseignant'
}

export function useIsAdmin(): boolean {
  return useUserRole() === 'admin'
}

export function useIsStudent(): boolean {
  return useUserRole() === null
}