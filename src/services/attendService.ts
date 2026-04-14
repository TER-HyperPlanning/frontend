import { apiDelete, apiGet } from '@/services/apiClient'

interface AttendModel {
  groupId: string | null
  sessionId: string | null
}

export function getAttendsByGroup(groupId: string): Promise<AttendModel[]> {
  return apiGet<AttendModel[]>(`/Attends/group/${groupId}`)
}

export function deleteAttend(groupId: string, sessionId: string): Promise<string> {
  const query = new URLSearchParams({ groupId, sessionId }).toString()
  return apiDelete<string>(`/Attends?${query}`)
}

export function deleteAttendsByGroup(groupId: string): Promise<string> {
  const query = new URLSearchParams({ groupId }).toString()
  return apiDelete<string>(`/Attends?${query}`)
}
