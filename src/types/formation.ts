export interface Filiere {
  id: string
  nom: string
}

export interface Formation {
  id: string
  nom: string
  enseignantResponsable: string
  programme: string
  lieu: string
  filiere: Filiere
}

export interface SelectOption {
  value: string
  label: string
}

export const FILIERE_OPTIONS: SelectOption[] = [
  { value: 'MIAGE', label: 'MIAGE' },
  { value: 'INFO', label: 'INFO' },
]

export const ENSEIGNANT_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Guillaume POSTIC' },
  { value: '2', label: 'Nathalie DAVID' },
  { value: '3', label: 'Hanna KLAUDEL' },
  { value: '4', label: 'Jean DUPONT' },
  { value: '5', label: 'Marie MARTIN' },
]
