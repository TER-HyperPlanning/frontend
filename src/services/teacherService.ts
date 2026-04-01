import { type TeacherResponse } from '@/types/formation'
import { apiGet } from '@/services/apiClient'

export function getTeachers(): Promise<TeacherResponse[]> {
  return apiGet<TeacherResponse[]>('/Teachers')
}
