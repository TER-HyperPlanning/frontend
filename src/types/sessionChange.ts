export interface SessionChange {
  id: string

  teacherId: string
  teacherName: string
  teacherEmail: string

  concernedTeacherId: string
  concernedTeacherName: string
  concernedTeacherEmail: string

  sessionId: string
  courseName: string
  sessionDate: string

  sessionStartTime: any
  sessionEndTime: any

  currentRoomId: string
  currentRoomNumber: string
  currentBuildingName: string

  changeStatusId: string
  changeStatusLabel: string
  changeType: string

  reason: string
  requestDate: string

  oldRoomId: string
  approvedRoomId?: string

  proposedDate?: string
  proposedStartTime: any
  proposedEndTime: any
  proposedRoomId?: string

  counterProposalDate?: string
  counterProposalStartTime: any
  counterProposalEndTime: any
  counterProposalRoomId?: string

  rejectionReason?: string
}