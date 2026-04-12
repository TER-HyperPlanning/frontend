export type SessionMode = 'PRESENTIAL' | 'ONLINE' | 'HYBRID'
export type SessionType = 'CM' | 'TD' | 'TP'
export type SessionStatus = 'PROGRAMME'

export interface SessionResponse {
  id: string
  startDateTime: string
  endDateTime: string
  mode: SessionMode
  type: SessionType
  status: SessionStatus
  room: string | null
  description: string | null
  course: string | null
}

export interface SessionWithGroup extends SessionResponse {
  /** Premier groupe lié (affichage) */
  groupId: string | null
  groupName: string | null
  /** Tous les groupId liés via Attends (une séance peut concerner plusieurs groupes) */
  groupIds: string[]
}

export interface CreateSessionRequest {
  startDateTime: string
  endDateTime: string
  mode: SessionMode
  sessionType: SessionType
  courseId: string
  sessionStatus: SessionStatus
  roomId: string
  description: string
}

export interface UpdateSessionRequest {
  startDateTime: string
  endDateTime: string
  mode: SessionMode
  sessionType: SessionType
  courseId: string
  sessionStatus: SessionStatus
  roomId: string
  description: string
}

export interface CourseResponse {
  id: string
  name: string
  code: string
}

export interface GroupModel {
  id: string
  name: string
  academicYear: string
  trackId: string
}

export interface RoomModel {
  roomId: string
  roomNumber: string
  isAvailable: boolean | null
  capacity: number
  buildingId: string
  type: string
}

export interface AttendResponse {
  groupId: string
  sessionId: string
}

export interface CreateAttendRequest {
  groupId: string
  sessionId: string
}

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  CM: 'Cours Magistral',
  TD: 'Travaux Dirigés',
  TP: 'Travaux Pratiques',
}

export const SESSION_MODE_LABELS: Record<SessionMode, string> = {
  PRESENTIAL: 'Présentiel',
  ONLINE: 'En ligne',
  HYBRID: 'Hybride',
}
