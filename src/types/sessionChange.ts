export interface SessionChange {

  status: 'En attente' | 'Approuvé' | 'Refusé'
  teacher: string
  email?: string
  type: 'Changement de salle' | 'Proposition de récupération de séance'

  subject: string
  formation: string
  sessionTime?: string
  requestDate: string
  groups?: string

  reason?: string
  rejectReason?: string

  concernedTeacher?: string
  concernedTeacherEmail?: string

  // salle actuelle
  currentRoom?: string
  currentRoomType?: string
  currentRoomCapacity?: string
  currentBuilding?: string

  // salle proposée
  recentRoom?: string
  recentRoomType?: string
  recentRoomCapacity?: string
  recentBuilding?: string

  // séance ratée
  missedSlot?: string
  missedRoom?: string
  missedRoomType?: string
  missedRoomCapacity?: string
  missedBuilding?: string

  // proposition professeur
  teacherProposalSlot?: string
  teacherProposalRoom?: string
  teacherProposalRoomType?: string
  teacherProposalRoomCapacity?: string
  teacherProposalBuilding?: string

  // proposition admin
  adminSlot?: string
  adminRoom?: string
  adminRoomType?: string
  adminRoomCapacity?: string
  adminBuilding?: string
}