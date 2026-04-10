import { useCallback } from 'react';
import { useAppClient } from '../hooks/api/useAppClient';
import type { WeekDayReponse } from '../types/date';
import type { ApiResponse } from './apiClient';

export function useweekDayService() {
  const { api } = useAppClient()

  const getWeekDay = useCallback(
    () =>
      api
        .get<ApiResponse<WeekDayReponse[]>>(`/WeekDay`)
        .then((r) => r.data.result),
    [api],
  )




  return {getWeekDay}
}
