import { useCallback } from 'react'
import { useAppClient } from '@/hooks/api/useAppClient'
import type { ApiResponse } from '@/services/apiClient'

export interface AdminDto {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
}

interface CreateAdminPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}

interface UpdateAdminPayload {
  email: string
  firstName: string
  lastName: string
  phone: string
}

export function useScolariteService() {
  const { api } = useAppClient()

  const getAdmins = useCallback(
    () => api.get<ApiResponse<AdminDto[]>>('/Admins').then((r) => r.data.result),
    [api],
  )

  const createAdmin = useCallback(
    (payload: CreateAdminPayload) =>
      api.post<ApiResponse<AdminDto>>('/Admins', payload).then((r) => r.data.result),
    [api],
  )

  const updateAdmin = useCallback(
    (id: string, payload: UpdateAdminPayload) =>
      api.put<ApiResponse<AdminDto>>(`/Admins/${id}`, payload).then((r) => r.data.result),
    [api],
  )

  const deleteAdmin = useCallback(
    (id: string) => api.delete<ApiResponse<string>>(`/Admins/${id}`).then((r) => r.data.result),
    [api],
  )

  return { getAdmins, createAdmin, updateAdmin, deleteAdmin }
}
