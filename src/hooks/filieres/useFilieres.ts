import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  type FiliereSummary,
  type ProgramModel,
  type TrackResponse,
} from '@/types/formation'
import { type AddFiliereValues } from '@/hooks/filieres/useAddFiliereForm'
import { type EditFiliereNameValues } from '@/hooks/filieres/useEditFiliereForm'
import { useProgramService } from '@/services/programService'
import { useTrackService } from '@/services/trackService'

function buildSummaries(
  programs: ProgramModel[],
  tracks: TrackResponse[],
): FiliereSummary[] {
  return programs
    .map((program) => {
      const formations = tracks
        .filter((t) => t.programId === program.id)
        .map((t) => ({ id: t.id, name: t.name }))
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
      return {
        id: program.id,
        nom: program.name,
        formations,
      }
    })
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
}

export function useFilieres() {
  const { getPrograms, createProgram, updateProgram, deleteProgram } = useProgramService()
  const { getTracks, deleteTrack } = useTrackService()

  const [filieres, setFilieres] = useState<FiliereSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filiereFilter, setFiliereFilter] = useState('all')

  const [isAddFiliereOpen, setIsAddFiliereOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<FiliereSummary | null>(null)
  const [deleteFiliereTarget, setDeleteFiliereTarget] = useState<FiliereSummary | null>(null)

  const [deleteFormationTarget, setDeleteFormationTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  const fetchFilieres = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [programs, tracks] = await Promise.all([
        getPrograms(),
        getTracks(),
      ])
      setFilieres(buildSummaries(programs, tracks))
      setError(null)
    } catch (err) {
      console.error('[useFilieres] Erreur lors du chargement:', err)
      // Ne pas écraser les filières existantes en cas d'erreur de rafraîchissement
      setError('Impossible de rafraîchir les filières.')
    } finally {
      setIsLoading(false)
    }
  }, [getPrograms, getTracks])

  useEffect(() => {
    fetchFilieres()
  }, [fetchFilieres])

  const filteredFilieres = useMemo(() => {
    let result = filieres
    if (filiereFilter !== 'all') {
      result = result.filter((f) => f.id === filiereFilter)
    }

    const q = searchQuery.toLowerCase().trim()
    if (!q) return result

    return result.filter((f) => {
      if (f.nom.toLowerCase().includes(q)) return true
      return f.formations.some(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
      )
    })
  }, [filieres, searchQuery, filiereFilter])

  const filieresOptions = useMemo(() => {
    return filieres.map((f) => ({ value: f.id, label: f.nom }))
  }, [filieres])

  async function addFiliere(values: AddFiliereValues) {
    const uniqueSuffix = '_' + Math.random().toString(36).substring(2, 8)
    await createProgram({
      name: values.nom,
      field: values.nom.substring(0, 42) + uniqueSuffix,
    })

    await fetchFilieres()
    setIsAddFiliereOpen(false)
  }



  async function renameFiliere(programId: string, values: EditFiliereNameValues) {
    const programs = await getPrograms()
    const p = programs.find((x) => x.id === programId)
    if (!p) return

    await updateProgram(programId, {
      name: values.nom,
      field: p.field,
    })

    await fetchFilieres()
    setRenameTarget(null)
  }

  async function removeFiliere(programId: string) {
    const tracks = await getTracks()
    const linked = tracks.filter((t) => t.programId === programId)
    if (linked.length > 0) {
      throw new Error(
        'Supprimez ou déplacez d\u0027abord toutes les formations de cette filière.',
      )
    }
    await deleteProgram(programId)
    await fetchFilieres()
    setDeleteFiliereTarget(null)
  }

  async function removeFormation(trackId: string) {
    const tracks = await getTracks()
    const programs = await getPrograms()
    const target = tracks.find((t) => t.id === trackId)
    if (target?.programId) {
      const program = programs.find((p) => p.id === target.programId)
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
    await fetchFilieres()
    setDeleteFormationTarget(null)
  }

  return {
    filieres: filteredFilieres,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filiereFilter,
    setFiliereFilter,
    filieresOptions,
    refetch: fetchFilieres,

    isAddFiliereOpen,
    openAddFiliere: () => setIsAddFiliereOpen(true),
    closeAddFiliere: () => setIsAddFiliereOpen(false),
    addFiliere,

    renameTarget,
    openRenameFiliere: (f: FiliereSummary) => setRenameTarget(f),
    closeRenameFiliere: () => setRenameTarget(null),
    renameFiliere,

    deleteFiliereTarget,
    openDeleteFiliere: (f: FiliereSummary) => setDeleteFiliereTarget(f),
    closeDeleteFiliere: () => setDeleteFiliereTarget(null),
    removeFiliere,

    deleteFormationTarget,
    openDeleteFormation: (p: { id: string; name: string }) => setDeleteFormationTarget(p),
    closeDeleteFormation: () => setDeleteFormationTarget(null),
    removeFormation,
  }
}
