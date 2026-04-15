import { useCallback } from 'react'
import {
  type TrackResponse,
  type CreateTrackRequest,
} from '@/types/formation'
import { useAppClient } from '@/hooks/api/useAppClient'
import { apiGet, type ApiResponse } from '@/services/apiClient'

// Plain function (used in async contexts outside of React hooks)
export function getTracks(): Promise<TrackResponse[]> {
  return apiGet<TrackResponse[]>('/Tracks')
}

export interface UpdateTrackRequest {
  name: string
  teacherId: string
  programId: string
  description?: string | null
  lieu?: string | null
}

/** Client HTTP pour `/Tracks` (formations). */
export function useTrackService() {
  const { api } = useAppClient()

  const getTracks = useCallback(
    () => api.get<ApiResponse<TrackResponse[]>>('/Tracks').then((r) => r.data.result),
    [api],
  )

  const getTrackById = useCallback(
    (id: string) =>
      api.get<ApiResponse<TrackResponse>>(`/Tracks/${id}`).then((r) => r.data.result),
    [api],
  )

  const createTrack = useCallback(
    (data: CreateTrackRequest) =>
      api.post<ApiResponse<TrackResponse>>('/Tracks', data).then((r) => r.data.result),
    [api],
  )

  const updateTrack = useCallback(
    (id: string, data: UpdateTrackRequest) =>
      api.put<void>(`/Tracks/${id}`, data).then(() => void 0),
    [api],
  )

  const deleteTrack = useCallback(
    (id: string) => api.delete<ApiResponse<string>>(`/Tracks/${id}`).then((r) => r.data.result),
    [api],
  )

  return { getTracks, getTrackById, createTrack, updateTrack, deleteTrack }
}
