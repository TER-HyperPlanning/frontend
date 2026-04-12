import type { SessionChange } from '@/types/sessionChange'

export const mockRequests: SessionChange[] = [
  // ----------------- Changement de salle approuvé -----------------
  {
    status: 'Approuvé',
    teacher: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    type: 'Changement de salle',
    subject: 'Informatique Avancée',
    formation: 'M2 MIAGE Informatique décisionnelle',
    sessionTime: '12/02/2026 · 10:00 - 12:00',
    requestDate: '08/02/2026 à 09:15',
    groups: 'G1, G3',
    currentRoom: '101',
    currentRoomType: 'Salle TD',
    currentRoomCapacity: '20',
    currentBuilding: 'A',
    recentRoom: '205',
    recentRoomType: 'Salle informatique',
    recentBuilding: 'B',
    recentRoomCapacity: '30',
    reason: 'Effectif plus important que prévu',
  },

  // ----------------- Changement de salle en attente -----------------
  {
    status: 'En attente',
    teacher: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    type: 'Changement de salle',
    subject: 'Base de données avancées',
    formation: 'M2 MIAGE Informatique décisionnelle',
    sessionTime: '14/02/2026 · 14:00 - 16:00',
    requestDate: '09/02/2026 à 11:30',
    groups: 'G2',
    currentRoom: '101',
    currentRoomType: 'Salle TD',
    currentRoomCapacity: '20',
    currentBuilding: 'A',
    reason: 'Besoin d’une salle plus adaptée aux travaux pratiques',
  },

  // ----------------- Changement de salle refusé -----------------
  {
    status: 'Refusé',
    teacher: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    type: 'Changement de salle',
    subject: 'Algorithmique avancée',
    formation: 'M2 MIAGE Informatique décisionnelle',
    sessionTime: '16/02/2026 · 08:00 - 10:00',
    requestDate: '10/02/2026 à 10:00',
    groups: 'G1, G2',
    currentRoom: '101',
    currentRoomType: 'Salle TD',
    currentRoomCapacity: '20',
    currentBuilding: 'A',
    reason: 'Salle trop petite pour le groupe',
    rejectReason: 'Aucune salle disponible dans le bâtiment A',
  },
  // ----------------- proposition en attente -----------------
  {
  status: 'En attente',
  type: 'Proposition de récupération de séance',
  teacher: 'Sophie Laurent',
  email: 'sophie.laurent@example.com',
  subject: 'Systèmes distribués',
  formation: 'M2 MIAGE Informatique décisionnelle',
  requestDate: '11/02/2026 à 13:20',
  groups: 'G1, G2',
  concernedTeacher:'Sophie Bourse',
  concernedTeacherEmail:'sophie.bourse@gmail.com',

  missedSlot: '15/02/2026 · 10:00 - 12:00',
  missedRoom: '101',
  missedRoomType: 'Salle TD',
  missedRoomCapacity: '20',
  missedBuilding: 'A',

  teacherProposalSlot: '20/02/2026 · 14:00 - 16:00',
  teacherProposalRoom: '202',
  teacherProposalRoomType: 'Salle informatique',
  teacherProposalRoomCapacity: '30',
  teacherProposalBuilding: 'B'
},
{
  status: 'Approuvé',
  type: 'Proposition de récupération de séance',
  teacher: 'Sophie Laurent',
  email: 'sophie.laurent@example.com',
  subject: 'Systèmes distribués',
  formation: 'M2 MIAGE Informatique décisionnelle',
  sessionTime: '18/02/2026 · 09:00 - 11:00',
  requestDate: '11/02/2026 à 13:20',
  groups: 'G1, G2',
  concernedTeacher:'Maria Bourse',
  concernedTeacherEmail:'maria.bourse@gmail.com',

  missedSlot: '15/02/2026 · 10:00 - 12:00',
  missedRoom: '101',
  missedRoomType: 'Salle TD',
  missedRoomCapacity: '20',
  missedBuilding: 'A',

  teacherProposalSlot: '20/02/2026 · 14:00 - 16:00',
  teacherProposalRoom: '202',
  teacherProposalRoomType: 'Salle informatique',
  teacherProposalRoomCapacity: '30',
  teacherProposalBuilding: 'B'
},
{
  status: 'Refusé',
  type: 'Proposition de récupération de séance',
  teacher: 'Sophie Laurent',
  email: 'sophie.laurent@example.com',
  subject: 'Réseaux et systèmes',
  formation: 'M2 MIAGE Informatique décisionnelle',
  sessionTime: '20/02/2026 · 10:00 - 12:00',
  requestDate: '12/02/2026 à 09:10',
  groups: 'G3',
  concernedTeacher:'Portic Yani',
  concernedTeacherEmail:'postic.yani@gmail.com',

  missedSlot: '16/02/2026 · 08:00 - 10:00',
  missedRoom: '101',
  missedRoomType: 'Salle TD',
  missedRoomCapacity: '20',
  missedBuilding: 'A',

  teacherProposalSlot: '20/02/2026 · 14:00 - 16:00',
  teacherProposalRoom: '202',
  teacherProposalRoomType: 'Salle informatique',
  teacherProposalRoomCapacity: '30',
  teacherProposalBuilding: 'B',
  
  adminSlot: '20/02/2026 · 14:00 - 16:00',
  adminRoom: '202',
  adminRoomType: 'Salle informatique',
  adminRoomCapacity: '30',
  adminBuilding: 'B',
  
  rejectReason: 'Créneau mieux adapté avec le planning'
}


]