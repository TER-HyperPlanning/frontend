import { useCallback } from 'react'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export interface AssignResponse {
  trackId: string
  courseId: string
  hourlyVolume: number
}

export function useAssignService() {
  const { api } = useAppClient()

  const getAssigns = useCallback(
    () => api.get<ApiResponse<AssignResponse[]>>('/Assign').then((r) => r.data.result),
    [api],
  )

  const getAssignsByTrack = useCallback(
    (trackId: string) =>
      api.get<ApiResponse<AssignResponse[]>>(`/Assign/${trackId}`).then((r) => r.data.result),
    [api],
  )

  return { getAssigns, getAssignsByTrack }
}
