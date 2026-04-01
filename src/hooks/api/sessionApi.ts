/**
 * Real Session API - Production
 * Uses useAppClient() for axios with JWT authentication
 * Swappable with mock API by changing imports
 */

import { useAppClient } from './useAppClient'
import type { Session, Disponibility } from './mock/sessionApi'

/**
 * Hook for using session API functions in components
 */
export function useSessionAPI() {
  const { api } = useAppClient()

  /**
   * Fetch all sessions from backend
   * GET /sessions
   */
  const getSessions = async (): Promise<Session[]> => {
    const response = await api.get('/sessions')
    return response.data.map((s: any) => ({
      ...s,
      start: new Date(s.start),
      end: new Date(s.end),
    }))
  }

  /**
   * Fetch disponibilities for teacher and group
   * GET /sessions/disponibilities?teacherId=X&groupId=Y
   */
  const getDisponibilities = async (
    teacherId: string,
    groupId: string,
  ): Promise<string[]> => {
    const response = await api.get('/sessions/disponibilities', {
      params: { teacherId, groupId },
    })
    return response.data.availableSlots || []
  }

  /**
   * Signal absence for a session
   * POST /sessions/{id}/absence
   */
  const declareAbsence = async (sessionId: string): Promise<boolean> => {
    try {
      await api.post(`/sessions/${sessionId}/absence`)
      return true
    } catch (error) {
      console.error('Failed to declare absence:', error)
      return false
    }
  }

  /**
   * Request to reschedule a session
   * POST /sessions/{id}/reschedule
   * Body: { newStart, newEnd }
   */
  const requestReschedule = async (
    sessionId: string,
    newStart: Date,
    newEnd: Date,
  ): Promise<boolean> => {
    try {
      await api.post(`/sessions/${sessionId}/reschedule`, {
        newStart: newStart.toISOString(),
        newEnd: newEnd.toISOString(),
      })
      return true
    } catch (error) {
      console.error('Failed to request reschedule:', error)
      return false
    }
  }

  return {
    getSessions,
    getDisponibilities,
    declareAbsence,
    requestReschedule,
  }
}

/**
 * Non-hook versions for use outside of React components
 * These create a temporary instance of useAppClient
 */

export async function getSessionsFromAPI(): Promise<Session[]> {
  const { api } = useAppClient()
  const response = await api.get('/sessions')
  return response.data.map((s: any) => ({
    ...s,
    start: new Date(s.start),
    end: new Date(s.end),
  }))
}

export async function getDisponibilitiesFromAPI(
  teacherId: string,
  groupId: string,
): Promise<string[]> {
  const { api } = useAppClient()
  const response = await api.get('/sessions/disponibilities', {
    params: { teacherId, groupId },
  })
  return response.data.availableSlots || []
}

export async function declareAbsenceFromAPI(
  sessionId: string,
): Promise<boolean> {
  try {
    const { api } = useAppClient()
    await api.post(`/sessions/${sessionId}/absence`)
    return true
  } catch (error) {
    console.error('Failed to declare absence:', error)
    return false
  }
}

export async function requestRescheduleFromAPI(
  sessionId: string,
  newStart: Date,
  newEnd: Date,
): Promise<boolean> {
  try {
    const { api } = useAppClient()
    await api.post(`/sessions/${sessionId}/reschedule`, {
      newStart: newStart.toISOString(),
      newEnd: newEnd.toISOString(),
    })
    return true
  } catch (error) {
    console.error('Failed to request reschedule:', error)
    return false
  }
}
