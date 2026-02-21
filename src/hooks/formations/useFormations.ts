import { useState, useMemo } from 'react'
import { type Formation } from '@/types/formation'
import { type EditFormationValues } from '@/hooks/formations/useEditFormationForm'

const MOCK_FORMATIONS: Formation[] = [
  {
    id: '1',
    nom: 'Ingé log pour le web',
    filiere: 'MIAGE',
    niveau: 'M1',
    responsable: 'Guillaume POSTIC',
  },
  {
    id: '2',
    nom: 'CNS',
    filiere: 'INFO',
    niveau: 'M2',
    responsable: 'Nathalie DAVID',
  },
  {
    id: '3',
    nom: 'CILS',
    filiere: 'INFO',
    niveau: 'L3',
    responsable: 'Hanna KLAUDEL',
  },
]

export function useFormations() {
  const [formations, setFormations] = useState<Formation[]>(MOCK_FORMATIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filiereFilter, setFiliereFilter] = useState('')
  const [niveauFilter, setNiveauFilter] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Formation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null)

  const filteredFormations = useMemo(() => {
    return formations.filter((f) => {
      const matchSearch = f.nom
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchFiliere = !filiereFilter || f.filiere === filiereFilter
      const matchNiveau = !niveauFilter || f.niveau === niveauFilter
      return matchSearch && matchFiliere && matchNiveau
    })
  }, [formations, searchQuery, filiereFilter, niveauFilter])

  function addFormation(formation: Omit<Formation, 'id' | 'responsable'>) {
    const newFormation: Formation = {
      ...formation,
      id: crypto.randomUUID(),
      responsable: '',
    }
    setFormations((prev) => [...prev, newFormation])
    setIsAddModalOpen(false)
  }

  function editFormation(id: string, values: EditFormationValues) {
    setFormations((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...values } : f)),
    )
    setEditTarget(null)
  }

  function deleteFormation(id: string) {
    setFormations((prev) => prev.filter((f) => f.id !== id))
    setDeleteTarget(null)
  }

  return {
    formations: filteredFormations,
    searchQuery,
    setSearchQuery,
    filiereFilter,
    setFiliereFilter,
    niveauFilter,
    setNiveauFilter,
    isAddModalOpen,
    openAddModal: () => setIsAddModalOpen(true),
    closeAddModal: () => setIsAddModalOpen(false),
    editTarget,
    openEditModal: (formation: Formation) => setEditTarget(formation),
    closeEditModal: () => setEditTarget(null),
    deleteTarget,
    openDeleteModal: (formation: Formation) => setDeleteTarget(formation),
    closeDeleteModal: () => setDeleteTarget(null),
    addFormation,
    editFormation,
    deleteFormation,
  }
}
