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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function programToFormation(
  program: ProgramModel,
  tracksByProgram: Map<string, TrackResponse[]>,
  trackMap: Map<string, { name: string }>,
  teacherMap: Map<string, string>,
): Formation {
  const tracks = tracksByProgram.get(program.id) ?? []
  const firstTrack = tracks[0]

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

  const teacherName = firstTrack?.teacherId
    ? (teacherMap.get(firstTrack.teacherId) ?? '')
    : ''

  return {
    id: program.id,
    nom: program.name,
    enseignantResponsable: teacherName,
    enseignantId: firstTrack?.teacherId ?? '',
    trackId: firstTrack?.id ?? '',
    programme: '',
    lieu: '',
    filiere: { id: program.field, nom: filiereName },
  }
}

export function useFormations() {
  const { getPrograms, createProgram, updateProgram, deleteProgram } = useProgramService()
  const { getTracks, updateTrack } = useTrackService()
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
      const [programs, tracks, teachers] = await Promise.all([
        getPrograms(),
        getTracks().catch(() => [] as TrackResponse[]),
        getTeachers().catch(() => [] as TeacherResponse[]),
      ])

      const trackMap = new Map(
        tracks.map((t) => [t.id, { name: t.name }]),
      )

      const tracksByProgram = new Map<string, TrackResponse[]>()
      for (const t of tracks) {
        const arr = tracksByProgram.get(t.programId) ?? []
        arr.push(t)
        tracksByProgram.set(t.programId, arr)
      }

      const teacherMap = new Map(
        teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`]),
      )

      setFormations(
        programs.map((p) =>
          programToFormation(p, tracksByProgram, trackMap, teacherMap),
        ),
      )
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
    const newProgram = await createProgram({
      name: values.nom,
      field: values.filiereId,
    })

    if (values.enseignantId && values.filiereId && newProgram?.id) {
      const tracks = await getTracks().catch(() => [] as TrackResponse[])
      const track = tracks.find((t) => t.id === values.filiereId)
      if (track) {
        await updateTrack(track.id, {
          name: track.name,
          teacherId: values.enseignantId,
          programId: newProgram.id,
        }).catch(() => {})
      }
    }

    await fetchFormations()
    setIsAddModalOpen(false)
  }

  async function editFormation(id: string, values: EditFormationValues) {
    await updateProgram(id, {
      name: values.nom,
      field: values.filiereId,
    })

    const target = formations.find((f) => f.id === id)
    if (values.enseignantId && target?.trackId) {
      const track = (await getTracks().catch(() => [])).find((t) => t.id === target.trackId)
      if (track) {
        await updateTrack(target.trackId, {
          name: track.name,
          teacherId: values.enseignantId,
          programId: id,
        }).catch(() => {})
      }
    }

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
