import { useCallback } from 'react'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

export interface CourseResponse {
  id: string
  name: string
  code: string
}

export function useCourseService() {
  const { api } = useAppClient()

  const getCourses = useCallback(
    () => api.get<ApiResponse<CourseResponse[]>>('/Courses').then((r) => r.data.result),
    [api],
  )

  const getCourseById = useCallback(
    (id: string) => api.get<ApiResponse<CourseResponse>>(`/Courses/${id}`).then((r) => r.data.result),
    [api],
  )

  return { getCourses, getCourseById }
}
