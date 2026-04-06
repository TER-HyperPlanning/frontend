import { useCallback } from 'react'
import { type TeacherResponse } from '@/types/formation'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export function useTeacherService() {
  const { api } = useAppClient()

  const getTeachers = useCallback(
    () => api.get<ApiResponse<TeacherResponse[]>>('/Teachers').then((r) => r.data.result),
    [api],
  )

  return { getTeachers }
}
