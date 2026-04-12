import { useCallback } from 'react'
import {
  type SessionResponse,
  type CreateSessionRequest,
  type UpdateSessionRequest,
  type AttendResponse,
  type CreateAttendRequest,
} from '@/types/session'
import { useAppClient } from '@/hooks/api/useAppClient'
import { type ApiResponse } from '@/services/apiClient'

class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function unwrap<T>(data: ApiResponse<T>): T {
  const s = (data.status ?? '').toLowerCase()
  if (s && s !== 'success' && s !== 'ok') {
    throw new ApiError(data.message || 'Erreur serveur')
  }
  return data.result
}

export function useSessionService() {
  const { api } = useAppClient()

  const getSessions = useCallback(
    () => api.get<ApiResponse<SessionResponse[]>>('/Sessions').then((r) => unwrap(r.data)),
    [api],
  )

  const getSessionById = useCallback(
    (id: string) => api.get<ApiResponse<SessionResponse>>(`/Sessions/${id}`).then((r) => unwrap(r.data)),
    [api],
  )

  const createSession = useCallback(
    (data: CreateSessionRequest) => api.post<ApiResponse<SessionResponse>>('/Sessions', data).then((r) => unwrap(r.data)),
    [api],
  )

  const updateSession = useCallback(
    (id: string, data: UpdateSessionRequest) => api.put<ApiResponse<SessionResponse>>(`/Sessions/${id}`, data).then((r) => unwrap(r.data)),
    [api],
  )

  const deleteSession = useCallback(
    (id: string) => api.delete<ApiResponse<string>>(`/Sessions/${id}`).then((r) => unwrap(r.data)),
    [api],
  )

  const getAllAttends = useCallback(
    () => api.get<ApiResponse<AttendResponse[]>>('/Attends').then((r) => unwrap(r.data)),
    [api],
  )

  const getAttendsBySession = useCallback(
    (sessionId: string) => api.get<ApiResponse<AttendResponse[]>>(`/Attends/session/${sessionId}`).then((r) => unwrap(r.data)),
    [api],
  )

  const createAttend = useCallback(
    (data: CreateAttendRequest) => api.post<ApiResponse<AttendResponse>>('/Attends', data).then((r) => unwrap(r.data)),
    [api],
  )

  const deleteAttend = useCallback(
    (groupId: string, sessionId: string) =>
      api.delete<ApiResponse<string>>('/Attends', { params: { groupId, sessionId } }).then((r) => unwrap(r.data)),
    [api],
  )

  return {
    getSessions, getSessionById,
    createSession, updateSession, deleteSession,
    getAllAttends, getAttendsBySession, createAttend, deleteAttend,
  }
}
