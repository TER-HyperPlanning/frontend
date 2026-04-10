import { useCallback } from 'react'
import { type TrackResponse } from '@/types/formation'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export interface UpdateTrackRequest {
  name: string
  teacherId: string
  programId: string
}

export function useTrackService() {
  const { api } = useAppClient()

  const getTracks = useCallback(
    () => api.get<ApiResponse<TrackResponse[]>>('/Tracks').then((r) => r.data.result),
    [api],
  )

  const updateTrack = useCallback(
    (id: string, data: UpdateTrackRequest) =>
      api.put<ApiResponse<TrackResponse>>(`/Tracks/${id}`, data).then((r) => r.data.result),
    [api],
  )

  return { getTracks, updateTrack }
}
