import { useCallback } from 'react'
import { type TrackResponse } from '@/types/formation'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export function useTrackService() {
  const { api } = useAppClient()

  const getTracks = useCallback(
    () => api.get<ApiResponse<TrackResponse[]>>('/Tracks').then((r) => r.data.result),
    [api],
  )

  return { getTracks }
}
