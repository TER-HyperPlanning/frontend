// ── Frontend model (US7/US8) ──

export interface Filiere {
  id: string
  nom: string
}

export interface Formation {
  id: string
  nom: string
  enseignantResponsable: string
  enseignantId: string
  trackId: string
  programme: string
  lieu: string
  filiere: Filiere
}

export interface SelectOption {
  value: string
  label: string
}

// ── API models (Swagger) ──

export interface ProgramModel {
  id: string
  name: string
  field: string
}

export interface CreateProgramRequest {
  name: string
  field: string
}

export interface UpdateProgramRequest {
  name: string
  field: string
}

export interface TeacherResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  matricule: string
  title: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface TrackResponse {
  id: string
  name: string
  teacherId: string
  programId: string
}

export interface GroupModel {
  id: string
  name: string
  academicYear: string
  capacity?: number
  trackId: string
}

export interface CreateGroupRequest {
  name: string
  academicYear: string
  capacity: number
  trackId: string
}

export interface UpdateGroupRequest {
  name: string
  academicYear: string
  capacity: number
  trackId: string
}

export interface StudentModel {
  id: string
  email: string
  password?: string
  firstName: string
  lastName: string
  phone: string
  role?: string
  createdAt?: string
  updatedAt?: string
  groupId: string | null
}

export interface CreateStudentRequest {
  email: string
  password?: string
  firstName: string
  lastName: string
  phone: string
  groupId?: string | null
}

export interface UpdateStudentRequest {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  groupId?: string | null
}
