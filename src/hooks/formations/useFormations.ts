import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  type Formation,
  type ProgramModel,
  type TrackResponse,
  type TeacherResponse,
} from '@/types/formation'
import { type AddFormationValues } from '@/hooks/formations/useAddFormationForm'
import { type EditFormationValues } from '@/hooks/formations/useEditFormationForm'
import { useProgramService } from '@/services/programService'
import { useTrackService } from '@/services/trackService'
import { useTeacherService } from '@/services/teacherService'

function trackToFormation(
  track: TrackResponse,
  programById: Map<string, ProgramModel>,
  teacherMap: Map<string, string>,
): Formation {
  const program = track.programId ? programById.get(track.programId) : undefined
  const teacherName = track.teacherId
    ? (teacherMap.get(track.teacherId) ?? '')
    : ''

  return {
    id: track.id,
    nom: track.name,
    enseignantResponsable: teacherName,
    enseignantId: track.teacherId ?? '',
    trackId: track.id,
    programme: track.description ?? '',
    lieu: track.lieu ?? '',
    filiere: {
      id: program?.id ?? '',
      nom: program?.name ?? '',
    },
  }
}

export function useFormations() {
  const { getPrograms, updateProgram } = useProgramService()
  const { getTracks, createTrack, updateTrack, deleteTrack } = useTrackService()
  const { getTeachers } = useTeacherService()
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
      const [tracks, programs, teachers] = await Promise.all([
        getTracks().catch(() => [] as TrackResponse[]),
        getPrograms().catch(() => [] as ProgramModel[]),
        getTeachers().catch(() => [] as TeacherResponse[]),
      ])

      const programById = new Map(programs.map((p) => [p.id, p]))
      const teacherMap = new Map(
        teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`]),
      )

      setFormations(tracks.map((t) => trackToFormation(t, programById, teacherMap)))
    } catch {
      setFormations([])
      setError('Impossible de charger les formations.')
    } finally {
      setIsLoading(false)
    }
  }, [getPrograms, getTracks, getTeachers])

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
        f.filiere.nom.toLowerCase().includes(query) ||
        f.enseignantResponsable.toLowerCase().includes(query)

      return matchFiliere && matchSearch
    })
  }, [formations, searchQuery, filiereFilter])

  async function addFormation(values: AddFormationValues) {
    await createTrack({
      name: values.nom,
      teacherId: values.enseignantId,
      programId: values.filiereId,
      description: values.programme || null,
      lieu: values.lieu || null,
    })

    await fetchFormations()
    setIsAddModalOpen(false)
  }

  async function editFormation(trackId: string, values: EditFormationValues) {
    await updateTrack(trackId, {
      name: values.nom,
      teacherId: values.enseignantId,
      programId: values.filiereId,
      description: values.programme || null,
      lieu: values.lieu || null,
    })

    await fetchFormations()
    setEditTarget(null)
  }

  async function deleteFormationById(trackId: string) {
    const [tracks, programs] = await Promise.all([
      getTracks().catch(() => [] as TrackResponse[]),
      getPrograms().catch(() => [] as ProgramModel[]),
    ])
    const doomed = tracks.find((t) => t.id === trackId)
    if (doomed?.programId) {
      const program = programs.find((p) => p.id === doomed.programId)
      if (program) {
        const normalized = program.field.replace(/_[0-9a-z]{6}$/i, '')
        if (program.field === trackId || normalized === trackId) {
          const otherTrack = tracks.find(
            (t) => t.programId === program.id && t.id !== trackId,
          )
          await updateProgram(program.id, {
            name: program.name,
            field: otherTrack?.id ?? program.field,
          }).catch(() => {})
        }
      }
    }

    await deleteTrack(trackId)
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
