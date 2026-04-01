import { type TrackResponse } from '@/types/formation'
import { apiGet } from '@/services/apiClient'

export function getTracks(): Promise<TrackResponse[]> {
  return apiGet<TrackResponse[]>('/Tracks')
}
