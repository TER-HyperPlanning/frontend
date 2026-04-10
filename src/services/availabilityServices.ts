import { useCallback } from 'react';
import { useAppClient } from '../hooks/api/useAppClient';
import type { AvailabilityGet, AvailabilityPost, AvailabilityPut } from '../types/date';
import type { ApiResponse } from './apiClient';

export function useAvailabilityService() {
  const { api } = useAppClient()

  const postAvailability = useCallback(
    (data: AvailabilityPost) =>
      api
        .post<ApiResponse<AvailabilityPost>>('/Availabilities', data)
        .then((r) => r.data.result),
    [api],
  )

  const getAvailabilities = useCallback(
    (teacherId : string) =>
      api
        .get<ApiResponse<AvailabilityGet[]>>(`/Availabilities/teacher/${teacherId}`)
        .then((r) => r.data.result),
    [api],
  )


  const putAvailability = useCallback(
    (availabilityId:string, data : AvailabilityPut) =>
      api
        .put<ApiResponse<AvailabilityPut>>(`/Availabilities/${availabilityId}`,data)
        .then((r) => r.data.result),
    [api],
  )

  const deleteAvailability = useCallback(
    (availabilityId:string) =>
      api
        .delete<ApiResponse<AvailabilityPost>>(`/Availabilities/${availabilityId}`)
        .then((r) => r.data.result),
    [api],
  )



  return {postAvailability,getAvailabilities,putAvailability, deleteAvailability}
}
