import { useState, useMemo, useEffect, useCallback } from 'react'
import { type Formation, type ProgramModel } from '@/types/formation'
import { type AddFormationValues } from '@/hooks/formations/useAddFormationForm'
import { type EditFormationValues } from '@/hooks/formations/useEditFormationForm'
import { useProgramService } from '@/services/programService'
import { useTrackService } from '@/services/trackService'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function programToFormation(
  program: ProgramModel,
  trackMap: Map<string, { name: string }>,
): Formation {
  const trackEntry =
    trackMap.get(program.field) ??
    Array.from(trackMap.values()).find(
      (t) => t.name.toLowerCase() === program.field.toLowerCase(),
    )

  const filiereName = trackEntry
    ? trackEntry.name
    : UUID_REGEX.test(program.field)
      ? ''
      : program.field

  return {
    id: program.id,
    nom: program.name,
    enseignantResponsable: '',
    programme: '',
    lieu: '',
    filiere: { id: program.field, nom: filiereName },
  }
}

export function useFormations() {
  const { getPrograms, createProgram, updateProgram, deleteProgram } = useProgramService()
  const { getTracks } = useTrackService()
  const [formations, setFormations] = useState<Formation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filiereFilter, setFiliereFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Formation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null)

  const fetchFormations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [programs, tracks] = await Promise.all([
        getPrograms(),
        getTracks().catch(() => []),
      ])

      const trackMap = new Map(
        tracks.map((t) => [t.id, { name: t.name }]),
      )

      setFormations(
        programs.map((p) => programToFormation(p, trackMap)),
      )
    } catch {
      setFormations([])
      setError('Impossible de charger les formations.')
    } finally {
      setIsLoading(false)
    }
  }, [getPrograms, getTracks])

  useEffect(() => {
    fetchFormations()
  }, [fetchFormations])

  const filteredFormations = useMemo(() => {
    return formations.filter((f) => {
      const matchFiliere =
        filiereFilter === 'all' || f.filiere.nom === filiereFilter

      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        f.nom.toLowerCase().includes(query) ||
        f.filiere.nom.toLowerCase().includes(query)

      return matchFiliere && matchSearch
    })
  }, [formations, searchQuery, filiereFilter])

  async function addFormation(values: AddFormationValues) {
    await createProgram({
      name: values.nom,
      field: values.filiereId,
    })
    await fetchFormations()
    setIsAddModalOpen(false)
  }

  async function editFormation(id: string, values: EditFormationValues) {
    await updateProgram(id, {
      name: values.nom,
      field: values.filiereId,
    })
    await fetchFormations()
    setEditTarget(null)
  }

  async function deleteFormationById(id: string) {
    await deleteProgram(id)
    await fetchFormations()
    setDeleteTarget(null)
  }

  return {
    formations: filteredFormations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filiereFilter,
    setFiliereFilter,
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
    deleteFormation: deleteFormationById,
    refetch: fetchFormations,
  }
}
