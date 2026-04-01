import type { Group, Student } from './types'

export const mockStudents: Student[] = [
  { id: 's1', nom: 'Martin', prenom: 'Alice', email: 'alice.martin@univ.fr', groupeId: null },
  { id: 's2', nom: 'Dupont', prenom: 'Lucas', email: 'lucas.dupont@univ.fr', groupeId: null },
  { id: 's3', nom: 'Bernard', prenom: 'Emma', email: 'emma.bernard@univ.fr', groupeId: '1' },
  { id: 's4', nom: 'Leroy', prenom: 'Nathan', email: 'nathan.leroy@univ.fr', groupeId: null },
  { id: 's5', nom: 'Moreau', prenom: 'Chloé', email: 'chloe.moreau@univ.fr', groupeId: '2' },
  { id: 's6', nom: 'Simon', prenom: 'Hugo', email: 'hugo.simon@univ.fr', groupeId: null },
  { id: 's7', nom: 'Laurent', prenom: 'Inès', email: 'ines.laurent@univ.fr', groupeId: null },
  { id: 's8', nom: 'Petit', prenom: 'Théo', email: 'theo.petit@univ.fr', groupeId: '1' },
]

export const mockGroupes: Group[] = [
  { id: '1', nom: 'Groupe A', type: 'FI', formation: 'Informatique', classe: 'L3', capacite: 30, effectif: 28 },
  { id: '2', nom: 'Groupe B', type: 'FA', formation: 'Informatique', classe: 'M1', capacite: 25, effectif: 23 },
  { id: '3', nom: 'Groupe C', type: 'FI', formation: 'Mathématiques', classe: 'L2', capacite: 35, effectif: 32 },
  { id: '4', nom: 'Groupe D', type: 'FA', formation: 'Physique', classe: 'M2', capacite: 20, effectif: 18 },
  { id: '5', nom: 'Groupe E', type: 'FI', formation: 'Informatique', classe: 'L1', capacite: 40, effectif: 35 },
]
