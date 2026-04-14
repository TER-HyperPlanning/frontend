import { apiDelete, apiGet, apiPost, apiPut } from '@/services/apiClient'
import type { CreateStudentRequest, StudentModel, UpdateStudentRequest } from '@/types/formation'

export function getStudents(): Promise<StudentModel[]> {
  return apiGet<StudentModel[]>('/Students')
}

export function getStudentById(id: string): Promise<StudentModel> {
  return apiGet<StudentModel>(`/Students/${id}`)
}

export function createStudent(data: CreateStudentRequest): Promise<StudentModel> {
  return apiPost<StudentModel>('/Students', data)
}

export function updateStudent(id: string, data: UpdateStudentRequest): Promise<StudentModel> {
  return apiPut<StudentModel>(`/Students/${id}`, data)
}

export function deleteStudent(id: string): Promise<string> {
  return apiDelete<string>(`/Students/${id}`)
}
