import { useCallback } from 'react'
import { type CourseResponse } from '@/types/session'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export function useCourseService() {
  const { api } = useAppClient()

  const getCourses = useCallback(
    () => api.get<ApiResponse<CourseResponse[]>>('/Courses').then((r) => r.data.result),
    [api],
  )

  return { getCourses }
}
