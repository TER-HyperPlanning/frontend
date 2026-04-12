import { useCallback } from 'react'
import { useAppClient } from '@/hooks/api/useAppClient'
import { mockRequests } from '@/components/requests/mockRequests'
import type { SessionChange } from '@/types/sessionChange'
import type { ApiResponse } from '@/services/apiClient'

export function useSessionChangeService() {
  const { api } = useAppClient()

  
  const getRequests = useCallback(async () => {
    return Promise.resolve(mockRequests)

    // FUTUR BACKEND
    // return api
    //   .get<ApiResponse<SessionChange[]>>('/SessionChanges')
    //   .then((r) => r.data.result)
  }, [])

  const getSessionChangeById = useCallback(
    (id: string) => {
      return api
        .get<ApiResponse<SessionChange>>(`/SessionChanges/${id}`)
        .then((r) => r.data.result)
    },
    [api],
  )

  const approveRoom = useCallback(
    (id: string) => {
      return api
        .post<ApiResponse<any>>(`/SessionChanges/${id}/approve-room`)
        .then((r) => r.data.result)
    },
    [api],
  )

  const approveRecovery = useCallback(
    (id: string) => {
      return api
        .post<ApiResponse<any>>(`/SessionChanges/${id}/approve-recovery`)
        .then((r) => r.data.result)
    },
    [api],
  )

  const rejectSessionChange = useCallback(
    (data: { id: string; reason: string }) => {
      return api
        .post<ApiResponse<any>>(`/SessionChanges/${data.id}/reject`, { reason: data.reason })
        .then((r) => r.data.result)
    },
    [api],
  )

  const counterProposal = useCallback(
    (id: string, payload: any) => {
      return api
        .post<ApiResponse<any>>(
          `/SessionChanges/${id}/counter-proposal`,
          payload,
        )
        .then((r) => r.data.result)
    },
    [api],
  )

  const getGroup = useCallback(
    (id: string) => {
      return api
        .get<ApiResponse<any>>(`/Groups/${id}`)
        .then((r) => r.data.result)
    },
    [api],
  )

  const getRoom = useCallback(
    (id: string) => {
      return api
        .get<ApiResponse<any>>(`/Room/${id}`)
        .then((r) => r.data.result)
    },
    [api],
  )

  const getBuilding = useCallback(
    (id: string) => {
      return api
        .get<ApiResponse<any>>(`/Buildings/${id}`)
        .then((r) => r.data.result)
    },
    [api],
  )

  return {
    getRequests,
    getSessionChangeById,
    approveRoom,
    approveRecovery,
    rejectSessionChange,
    counterProposal,
    getGroup,
    getRoom,
    getBuilding,
  }
}