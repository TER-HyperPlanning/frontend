import { useCallback } from 'react'
import { useAppClient } from '../hooks/api/useAppClient'
import type {
  GroupPropsEndPointRes,
  GroupPropsParam
} from '../types/date'
import type { ApiResponse } from './apiClient'

export function useAvailabilityGroupService() {
  const { api } = useAppClient()

  const postAvailabilityGroup = useCallback(
    (data: GroupPropsParam) =>
      api
        .post<ApiResponse<GroupPropsEndPointRes>>('/AvailabilityGroups', data)
        .then((r) => r.data.result),
    [api],
  )

  const getAvailabilityGroup = useCallback(
    (teacherId: string) =>
      api
        .get<
          ApiResponse<GroupPropsEndPointRes[]>
        >(`/AvailabilityGroups/teacher/${teacherId}`)
        .then((r) => r.data.result),
    [api],
  )

  const putAvailabilityGroup = useCallback(
    (availabilityId: string, data: GroupPropsParam) =>
      api
        .put<
          ApiResponse<GroupPropsParam>
        >(`/AvailabilityGroups/${availabilityId}`, data)
        .then((r) => r.data.result),
    [api],
  )

  const deleteAvailabilityGroup = useCallback(
    (availabilityId: string) =>
      api
        .delete<
          ApiResponse<GroupPropsParam>
        >(`/AvailabilityGroups/${availabilityId}`)
        .then((r) => r.data.result),
    [api],
  )

  return {
    postAvailabilityGroup,
    getAvailabilityGroup,
    putAvailabilityGroup,
    deleteAvailabilityGroup,
  }
}
