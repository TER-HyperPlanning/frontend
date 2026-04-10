import { useCallback } from 'react'
import { type RoomModel } from '@/types/session'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export function useRoomService() {
  const { api } = useAppClient()

  const getRooms = useCallback(
    () => api.get<ApiResponse<RoomModel[]>>('/Room').then((r) => r.data.result),
    [api],
  )

  return { getRooms }
}
