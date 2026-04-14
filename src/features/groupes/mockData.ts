import type { Group, Student } from './types'

export const mockStudents: Student[] = [
  { id: 's1', firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@univ.fr', phone: '', groupId: null },
  { id: 's2', firstName: 'Lucas', lastName: 'Dupont', email: 'lucas.dupont@univ.fr', phone: '', groupId: null },
  { id: 's3', firstName: 'Emma', lastName: 'Bernard', email: 'emma.bernard@univ.fr', phone: '', groupId: '1' },
  { id: 's4', firstName: 'Nathan', lastName: 'Leroy', email: 'nathan.leroy@univ.fr', phone: '', groupId: null },
  { id: 's5', firstName: 'Chloé', lastName: 'Moreau', email: 'chloe.moreau@univ.fr', phone: '', groupId: '2' },
  { id: 's6', firstName: 'Hugo', lastName: 'Simon', email: 'hugo.simon@univ.fr', phone: '', groupId: null },
  { id: 's7', firstName: 'Inès', lastName: 'Laurent', email: 'ines.laurent@univ.fr', phone: '', groupId: null },
  { id: 's8', firstName: 'Théo', lastName: 'Petit', email: 'theo.petit@univ.fr', phone: '', groupId: '1' },
]

export const mockGroupes: Group[] = [
  { id: '1', name: 'Groupe A', academicYear: '2025-2026', trackId: 't1', programId: 'p1', trackName: 'Informatique', programName: 'Licence', studentCount: 28 },
  { id: '2', name: 'Groupe B', academicYear: '2025-2026', trackId: 't2', programId: 'p1', trackName: 'Mathématiques', programName: 'Licence', studentCount: 23 },
  { id: '3', name: 'Groupe C', academicYear: '2025-2026', trackId: 't1', programId: 'p2', trackName: 'Informatique', programName: 'Master', studentCount: 32 },
  { id: '4', name: 'Groupe D', academicYear: '2025-2026', trackId: 't3', programId: 'p2', trackName: 'Physique', programName: 'Master', studentCount: 18 },
  { id: '5', name: 'Groupe E', academicYear: '2025-2026', trackId: 't1', programId: 'p1', trackName: 'Informatique', programName: 'Licence', studentCount: 35 },
]
