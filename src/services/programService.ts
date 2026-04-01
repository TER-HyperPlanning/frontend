import { type ProgramModel, type CreateProgramRequest, type UpdateProgramRequest } from '@/types/formation'
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/apiClient'

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
