import { useCallback } from 'react'
import { type ProgramModel, type CreateProgramRequest, type UpdateProgramRequest } from '@/types/formation'
import { useAppClient } from '@/hooks/api/useAppClient'

export function useProgramService() {
  const { api } = useAppClient()

  const getPrograms = useCallback(
    () => api.get<ProgramModel[]>('/Programs').then((r) => r.data),
    [api],
  )

  const getProgramById = useCallback(
    (id: string) => api.get<ProgramModel>(`/Programs/${id}`).then((r) => r.data),
    [api],
  )

  const createProgram = useCallback(
    (data: CreateProgramRequest) => api.post<ProgramModel>('/Programs', data).then((r) => r.data),
    [api],
  )

  const updateProgram = useCallback(
    (id: string, data: UpdateProgramRequest) => api.put<ProgramModel>(`/Programs/${id}`, data).then((r) => r.data),
    [api],
  )

  const deleteProgram = useCallback(
    (id: string) => api.delete<string>(`/Programs/${id}`).then((r) => r.data),
    [api],
  )

  return { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram }
}
