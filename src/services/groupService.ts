import { useCallback } from 'react'
import { type GroupModel } from '@/types/session'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export function useGroupService() {
  const { api } = useAppClient()

  const getGroups = useCallback(
    () => api.get<ApiResponse<GroupModel[]>>('/Groups').then((r) => r.data.result),
    [api],
  )

  return { getGroups }
}
