export interface StudentResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  groupId: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface CreateStudentRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string | null
  groupId: string
}

export interface UpdateStudentRequest {
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  groupId: string
}

export interface GroupResponse {
  id: string
  name: string
  academicYear: string
  trackId: string
}
