import { useCallback } from 'react'
import { type ProgramModel, type CreateProgramRequest, type UpdateProgramRequest } from '@/types/formation'
import { useAppClient } from '@/hooks/api/useAppClient'
import { apiGet, apiPost, apiPut, apiDelete, type ApiResponse } from '@/services/apiClient'

// Plain functions (used in async contexts outside of React hooks)
export function getPrograms(): Promise<ProgramModel[]> {
  return apiGet<ProgramModel[]>('/Programs')
}

export function getProgramById(id: string): Promise<ProgramModel> {
  return apiGet<ProgramModel>(`/Programs/${id}`)
}

export function createProgram(data: CreateProgramRequest): Promise<ProgramModel> {
  return apiPost<ProgramModel>('/Programs', data)
}

export function updateProgram(id: string, data: UpdateProgramRequest): Promise<ProgramModel> {
  return apiPut<ProgramModel>(`/Programs/${id}`, data)
}

export function deleteProgram(id: string): Promise<string> {
  return apiDelete<string>(`/Programs/${id}`)
}

/** Client HTTP pour `/Programs` (filières). */
export function useProgramService() {
  const { api } = useAppClient()

  const getPrograms = useCallback(
    () => api.get<ApiResponse<ProgramModel[]>>('/Programs').then((r) => r.data.result),
    [api],
  )

  const getProgramById = useCallback(
    (id: string) => api.get<ApiResponse<ProgramModel>>(`/Programs/${id}`).then((r) => r.data.result),
    [api],
  )

  const createProgram = useCallback(
    (data: CreateProgramRequest) => api.post<ApiResponse<ProgramModel>>('/Programs', data).then((r) => r.data.result),
    [api],
  )

  const updateProgram = useCallback(
    (id: string, data: UpdateProgramRequest) => api.put<ApiResponse<ProgramModel>>(`/Programs/${id}`, data).then((r) => r.data.result),
    [api],
  )

  const deleteProgram = useCallback(
    (id: string) => api.delete<ApiResponse<string>>(`/Programs/${id}`).then((r) => r.data.result),
    [api],
  )

  return { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram }
}
