// ── Frontend model (US7/US8) ──

/** Filière (Program) associée à une formation affichée */
export interface Filiere {
  id: string
  nom: string
}

/** Formation (API Track) listée sous une filière — page Filières */
export interface FiliereFormationRow {
  id: string
  name: string
}

/** Filière (API Program) et la liste de ses formations (Tracks) */
export interface FiliereSummary {
  id: string
  nom: string
  formations: Array<FiliereFormationRow>
}

/** Ligne affichée page Formations : une formation (Track) et sa filière (Program) */
export interface Formation {
  id: string
  nom: string
  enseignantResponsable: string
  enseignantId: string
  /** Identifiant API du Track (= formation) — identique à `id` */
  trackId: string
  programme: string
  lieu: string
  filiere: Filiere
}

export interface SelectOption {
  value: string
  label: string
}

// ── API models (Swagger) — Program = filière, Track = formation ──

/** Filière (API `/Programs`) */
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

/** Formation (API `/Tracks`) */
export interface TrackResponse {
  id: string
  name: string
  teacherId: string
  programId: string
  description: string | null
  lieu: string | null
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

export interface CreateTrackRequest {
  name: string
  teacherId: string
  programId: string
  description?: string | null
  lieu?: string | null
}
