import { useCallback } from 'react'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'
import {
  type StudentResponse,
  type CreateStudentRequest,
  type UpdateStudentRequest,
  type GroupResponse,
} from './types'

export function useStudentService() {
  const { api } = useAppClient()

  const getStudents = useCallback(
    () => api.get<ApiResponse<StudentResponse[]>>('/Students').then((r) => r.data.result),
    [api],
  )

  const getGroups = useCallback(
    () => api.get<ApiResponse<GroupResponse[]>>('/Groups').then((r) => r.data.result),
    [api],
  )

  const createStudent = useCallback(
    (data: CreateStudentRequest) =>
      api.post<ApiResponse<StudentResponse>>('/Students', data).then((r) => r.data.result),
    [api],
  )

  const updateStudent = useCallback(
    (id: string, data: UpdateStudentRequest) =>
      api.put<ApiResponse<StudentResponse>>(`/Students/${id}`, data).then((r) => r.data.result),
    [api],
  )

  const deleteStudent = useCallback(
    (id: string) => api.delete<ApiResponse<string>>(`/Students/${id}`).then((r) => r.data.result),
    [api],
  )

  return { getStudents, getGroups, createStudent, updateStudent, deleteStudent }
}
