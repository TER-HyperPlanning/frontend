export type GroupType = 'FI' | 'FA'

export interface Group {
  id: string
  nom: string
  type: GroupType
  formation: string
  classe: string
  capacite: number
  effectif: number
}

export interface Student {
  id: string
  nom: string
  prenom: string
  email: string
  groupeId: string | null
}

export type SortKey = 'capacite' | 'effectif'

export interface SortConfig {
  key: SortKey | null
  direction: 'asc' | 'desc'
}
