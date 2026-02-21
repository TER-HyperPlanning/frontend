export interface Formation {
  id: string
  nom: string
  filiere: string
  niveau: string
  responsable: string
}

export interface SelectOption {
  value: string
  label: string
}

export const FILIERE_OPTIONS: SelectOption[] = [
  { value: 'MIAGE', label: 'MIAGE' },
  { value: 'INFO', label: 'INFO' },
]

export const NIVEAU_OPTIONS: SelectOption[] = [
  { value: 'L1', label: 'L1' },
  { value: 'L2', label: 'L2' },
  { value: 'L3', label: 'L3' },
  { value: 'M1', label: 'M1' },
  { value: 'M2', label: 'M2' },
]
