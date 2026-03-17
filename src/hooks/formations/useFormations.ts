import { useState, useMemo } from 'react'
import {
  type Formation,
  FILIERE_OPTIONS,
  ENSEIGNANT_OPTIONS,
} from '@/types/formation'
import { type AddFormationValues } from '@/hooks/formations/useAddFormationForm'
import { type EditFormationValues } from '@/hooks/formations/useEditFormationForm'

const MOCK_FORMATIONS: Formation[] = [
  {
    id: '1',
    nom: 'Ingénierie logicielle pour le web',
    enseignantResponsable: 'Guillaume POSTIC',
    programme: 'Développement web, bases de données, architecture logicielle',
    lieu: 'Campus Évry, Bâtiment IBGBI',
    filiere: { id: 'MIAGE', nom: 'MIAGE' },
  },
  {
    id: '2',
    nom: 'Cryptographie et Sécurité des Réseaux',
    enseignantResponsable: 'Nathalie DAVID',
    programme: 'Cryptographie, sécurité réseau, protocoles',
    lieu: 'Campus Évry, Bâtiment Maupertuis',
    filiere: { id: 'INFO', nom: 'INFO' },
  },
  {
    id: '3',
    nom: 'Conception et Intégration de Logiciels et Systèmes',
    enseignantResponsable: 'Hanna KLAUDEL',
    programme: 'Systèmes embarqués, intégration logicielle',
    lieu: 'Campus Évry, Bâtiment IBGBI',
    filiere: { id: 'INFO', nom: 'INFO' },
  },
]

export function useFormations() {
  const [formations, setFormations] = useState<Formation[]>(MOCK_FORMATIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Formation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null)

  const filteredFormations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return formations

    return formations.filter((f) => {
      const matchNom = f.nom.toLowerCase().includes(query)
      const matchEnseignant = f.enseignantResponsable
        .toLowerCase()
        .includes(query)
      const matchFiliere = f.filiere.nom.toLowerCase().includes(query)
      return matchNom || matchEnseignant || matchFiliere
    })
  }, [formations, searchQuery])

  function resolveFiliere(filiereId: string) {
    const option = FILIERE_OPTIONS.find((o) => o.value === filiereId)
    return { id: filiereId, nom: option?.label ?? filiereId }
  }

  function resolveEnseignant(enseignantId: string) {
    const option = ENSEIGNANT_OPTIONS.find((o) => o.value === enseignantId)
    return option?.label ?? enseignantId
  }

  function addFormation(values: AddFormationValues) {
    const newFormation: Formation = {
      id: crypto.randomUUID(),
      nom: values.nom,
      enseignantResponsable: resolveEnseignant(values.enseignantId),
      programme: values.programme,
      lieu: values.lieu,
      filiere: resolveFiliere(values.filiereId),
    }
    setFormations((prev) => [...prev, newFormation])
    setIsAddModalOpen(false)
  }

  function editFormation(id: string, values: EditFormationValues) {
    setFormations((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              nom: values.nom,
              enseignantResponsable: resolveEnseignant(values.enseignantId),
              programme: values.programme,
              lieu: values.lieu,
              filiere: resolveFiliere(values.filiereId),
            }
          : f,
      ),
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
