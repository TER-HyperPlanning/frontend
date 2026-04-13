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
import { useTeacherService } from '@/services/teacherService'

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
  const { getTracks, createTrack, deleteTrack } = useTrackService()
  const { getTeachers } = useTeacherService()

  const [filieres, setFilieres] = useState<FiliereSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
        getTracks().catch(() => [] as TrackResponse[]),
      ])
      setFilieres(buildSummaries(programs, tracks))
    } catch {
      setFilieres([])
      setError('Impossible de charger les filières.')
    } finally {
      setIsLoading(false)
    }
  }, [getPrograms, getTracks])

  useEffect(() => {
    fetchFilieres()
  }, [fetchFilieres])

  const filteredFilieres = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return filieres

    return filieres.filter((f) => {
      if (f.nom.toLowerCase().includes(q)) return true
      return f.formations.some(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
      )
    })
  }, [filieres, searchQuery])

  async function addFiliere(values: AddFiliereValues) {
    const teachers = await getTeachers().catch(() => [])
    const teacherId = teachers[0]?.id
    if (!teacherId) {
      throw new Error(
        'Aucun enseignant disponible : la création de filière nécessite un enseignant côté API.',
      )
    }

    const uniqueSuffix = '_' + Math.random().toString(36).substring(2, 8)
    const program = await createProgram({
      name: values.nom,
      field: values.nom.substring(0, 42) + uniqueSuffix,
    })

    const track = await createTrack({
      name: values.premiereFormation,
      teacherId,
      programId: program.id,
      description: null,
      lieu: null,
    })

    await updateProgram(program.id, {
      name: values.nom,
      field: track.id,
    })

    await fetchFilieres()
    setIsAddFiliereOpen(false)
  }

  async function importCSV(file: File) {
    setIsImporting(true)
    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
      if (lines.length < 2) throw new Error('Le fichier est vide ou n\u0027a pas d\u0027en-tête.')

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
      const indexFiliere = headers.findIndex((h) => h.includes('filiere') || h.includes('filière'))
      const indexFormation = headers.findIndex((h) => h.includes('formation'))
      const indexLieu = headers.findIndex((h) => h === 'lieu')
      const indexDesc = headers.findIndex((h) => h.includes('programme') || h.includes('description'))
      const indexEns = headers.findIndex((h) => h.includes('enseignant'))

      if (indexFiliere === -1 || indexFormation === -1) {
        throw new Error('Colonnes "Filiere" ou "Formation" introuvables.')
      }

      const teachers = await getTeachers().catch(() => [])
      const teacherId = teachers[0]?.id
      if (!teacherId) {
        throw new Error('Aucun enseignant disponible pour l\u0027API.')
      }

      let allTracks = await getTracks().catch(() => [] as TrackResponse[])
      const existingPrograms = await getPrograms().catch(() => [] as ProgramModel[])
      const programMap = new Map(existingPrograms.map((p) => [p.name.toLowerCase(), p]))

      let importedCount = 0

      for (let i = 1; i < lines.length; i++) {
        const rowText = lines[i]
        const columns: string[] = []
        let inQuotes = false
        let current = ''
        for (let j = 0; j < rowText.length; j++) {
          const char = rowText[j]
          if (char === '"') inQuotes = !inQuotes
          else if (char === ',' && !inQuotes) {
            columns.push(current)
            current = ''
          } else {
            current += char
          }
        }
        columns.push(current)

        const nomFiliere = columns[indexFiliere]?.replace(/^"|"$/g, '').trim().substring(0, 42)
        const nomFormation = columns[indexFormation]?.replace(/^"|"$/g, '').trim().substring(0, 50)
        const lieu = indexLieu !== -1 ? columns[indexLieu]?.replace(/^"|"$/g, '').trim() : null
        const desc = indexDesc !== -1 ? columns[indexDesc]?.replace(/^"|"$/g, '').trim() : null
        const ensRaw = indexEns !== -1 ? columns[indexEns]?.replace(/^"|"$/g, '').trim().toLowerCase() : null

        if (!nomFiliere || !nomFormation) continue

        let rowTeacherId = teacherId
        if (ensRaw && teachers.length > 0) {
          const matched = teachers.find(
            (t) =>
              t.email.toLowerCase() === ensRaw ||
              `${t.firstName} ${t.lastName}`.toLowerCase() === ensRaw ||
              `${t.lastName} ${t.firstName}`.toLowerCase() === ensRaw ||
              t.lastName.toLowerCase() === ensRaw,
          )
          if (matched) rowTeacherId = matched.id
        }

        const uniqueSuffix = '_' + Math.random().toString(36).substring(2, 8)

        let program = programMap.get(nomFiliere.toLowerCase())
        if (!program) {
          program = await createProgram({
            name: nomFiliere,
            field: nomFiliere.substring(0, 42) + uniqueSuffix,
          })
          programMap.set(nomFiliere.toLowerCase(), program)
        }

        const tracksForProgram = allTracks.filter((t) => t.programId === program.id)
        const existingFormation = tracksForProgram.find(
          (t) => t.name.toLowerCase() === nomFormation.toLowerCase(),
        )

        if (!existingFormation) {
          const track = await createTrack({
            name: nomFormation,
            teacherId: rowTeacherId,
            programId: program.id,
            description: desc || null,
            lieu: lieu || null,
          })
          allTracks = [...allTracks, track]

          await updateProgram(program.id, {
            name: nomFiliere,
            field: track.id,
          })
        }

        importedCount++
      }

      if (importedCount === 0) {
        throw new Error('Aucune ligne valide trouvée (colonnes attendues : Filiere, Formation)')
      }

      await fetchFilieres()
      return importedCount
    } finally {
      setIsImporting(false)
    }
  }

  async function renameFiliere(programId: string, values: EditFiliereNameValues) {
    const programs = await getPrograms().catch(() => [] as ProgramModel[])
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
    const tracks = await getTracks().catch(() => [] as TrackResponse[])
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
    const tracks = await getTracks().catch(() => [] as TrackResponse[])
    const programs = await getPrograms().catch(() => [] as ProgramModel[])
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
    isImporting,
    error,
    searchQuery,
    setSearchQuery,
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

    importCSV,
  }
}
