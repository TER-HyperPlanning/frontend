import type { Group, Student } from './types'

export const mockStudents: Student[] = [
  { id: 's1', firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@univ.fr', phone: '0600000001', groupId: null },
  { id: 's2', firstName: 'Lucas', lastName: 'Dupont', email: 'lucas.dupont@univ.fr', phone: '0600000002', groupId: null },
  { id: 's3', firstName: 'Emma', lastName: 'Bernard', email: 'emma.bernard@univ.fr', phone: '0600000003', groupId: '1' },
  { id: 's4', firstName: 'Nathan', lastName: 'Leroy', email: 'nathan.leroy@univ.fr', phone: '0600000004', groupId: null },
  { id: 's5', firstName: 'Chloé', lastName: 'Moreau', email: 'chloe.moreau@univ.fr', phone: '0600000005', groupId: '2' },
  { id: 's6', firstName: 'Hugo', lastName: 'Simon', email: 'hugo.simon@univ.fr', phone: '0600000006', groupId: null },
  { id: 's7', firstName: 'Inès', lastName: 'Laurent', email: 'ines.laurent@univ.fr', phone: '0600000007', groupId: null },
  { id: 's8', firstName: 'Théo', lastName: 'Petit', email: 'theo.petit@univ.fr', phone: '0600000008', groupId: '1' },
]

export const mockGroupes: Group[] = [
  { id: '1', name: 'Groupe A', academicYear: 'L3', trackId: 't1', trackName: 'Développement', programName: 'Informatique', studentCount: 2 },
  { id: '2', name: 'Groupe B', academicYear: 'M1', trackId: 't2', trackName: 'Réseaux', programName: 'Informatique', studentCount: 1 },
  { id: '3', name: 'Groupe C', academicYear: 'L2', trackId: 't3', trackName: 'Maths Appliquées', programName: 'Mathématiques', studentCount: 0 },
  { id: '4', name: 'Groupe D', academicYear: 'M2', trackId: 't4', trackName: 'Physique Avancée', programName: 'Physique', studentCount: 0 },
  { id: '5', name: 'Groupe E', academicYear: 'L1', trackId: 't1', trackName: 'Développement', programName: 'Informatique', studentCount: 0 },
]
