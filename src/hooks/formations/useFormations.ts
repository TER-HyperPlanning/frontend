import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  type Formation,
  type ProgramModel,
  type TrackResponse,
} from '@/types/formation'
import { type AddFormationValues } from '@/hooks/formations/useAddFormationForm'
import { type EditFormationValues } from '@/hooks/formations/useEditFormationForm'
import { useProgramService } from '@/services/programService'
import { useTrackService } from '@/services/trackService'
import { useTeacherService } from '@/services/teacherService'
import { useGroupService } from '@/services/groupService'

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
  const { getPrograms, updateProgram, createProgram } = useProgramService()
  const { getTracks, createTrack, updateTrack, deleteTrack } = useTrackService()
  const { getTeachers } = useTeacherService()
  const { getGroups } = useGroupService()
  const [formations, setFormations] = useState<Formation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filiereFilter, setFiliereFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Formation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null)

  const fetchFormations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [tracks, programs, teachers] = await Promise.all([
        getTracks(),
        getPrograms(),
        getTeachers(),
      ])

      const programById = new Map(programs.map((p) => [p.id, p]))
      const teacherMap = new Map(
        teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`]),
      )

      setFormations(tracks.map((t) => trackToFormation(t, programById, teacherMap)))
      setError(null)
    } catch (err) {
      console.error('[useFormations] Erreur lors du chargement:', err)
      // Ne pas écraser les formations existantes en cas d'erreur de rafraîchissement
      setError('Impossible de rafraîchir les formations.')
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

  const sortedAndFilteredFormations = useMemo(() => {
    const sorted = [...filteredFormations].sort((a, b) => {
      return a.nom.localeCompare(b.nom, 'fr')
    })
    return sortOrder === 'asc' ? sorted : sorted.reverse()
  }, [filteredFormations, sortOrder])

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
    const groups = await getGroups().catch(() => [])
    const linkedGroups = groups.filter((g) => g.trackId === trackId)
    if (linkedGroups.length > 0) {
      throw new Error(
        'Impossible de supprimer cette formation : des groupes y sont encore liés. Veuillez d\'abord supprimer ou déplacer ces groupes.',
      )
    }

    const [tracks, programs] = await Promise.all([
      getTracks(),
      getPrograms(),
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

  async function importCSV(file: File) {
    setIsImporting(true)
    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
      if (lines.length < 2) throw new Error('Le fichier est vide ou n\u0027a pas d\u0027en-tête.')

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
      const indexFormation = headers.findIndex((h) => h.includes('formation'))
      const indexEns = headers.findIndex((h) => h.includes('enseignant'))
      const indexLieu = headers.findIndex((h) => h === 'lieu')
      const indexFiliere = headers.findIndex((h) => h.includes('filiere') || h.includes('filière'))
      const indexDesc = headers.findIndex((h) => h.includes('description') || h.includes('programme'))

      if (indexFormation === -1) {
        throw new Error('La colonne "Formation" est introuvable.')
      }
      if (indexFiliere === -1) {
         throw new Error('La colonne "Filiere" est obligatoire pour associer la formation.')
      }

      const teachers = await getTeachers()
      const fallbackTeacherId = teachers[0]?.id
      if (!fallbackTeacherId) {
        throw new Error('Aucun enseignant disponible pour l\u0027API.')
      }

      let allTracks = await getTracks()
      const existingPrograms = await getPrograms()
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

        const nomFormation = columns[indexFormation]?.replace(/^"|"$/g, '').trim().substring(0, 50)
        const nomFiliere = columns[indexFiliere]?.replace(/^"|"$/g, '').trim().substring(0, 42)
        const lieu = indexLieu !== -1 ? columns[indexLieu]?.replace(/^"|"$/g, '').trim() : null
        const desc = indexDesc !== -1 ? columns[indexDesc]?.replace(/^"|"$/g, '').trim() : null
        const ensRaw = indexEns !== -1 ? columns[indexEns]?.replace(/^"|"$/g, '').trim().toLowerCase() : null

        if (!nomFormation || !nomFiliere) continue

        let rowTeacherId = fallbackTeacherId
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

        const existingFormation = allTracks.find(
          (t) => t.name.toLowerCase() === nomFormation.toLowerCase() && t.programId === program?.id,
        )

        if (!existingFormation && program) {
          const track = await createTrack({
            name: nomFormation,
            teacherId: rowTeacherId,
            programId: program.id,
            description: desc || null,
            lieu: lieu || null,
          })
          allTracks = [...allTracks, track]
          
          if (!program.field || program.field.includes('_')) {
             await updateProgram(program.id, {
                name: nomFiliere,
                field: track.id,
             }).catch(() => {})
          }
          importedCount++
        }
      }

      if (importedCount === 0) {
        throw new Error('Aucune nouvelle formation importée (fichier invalide ou tous sont des doublons)')
      }

      await fetchFormations()
      return importedCount
    } finally {
      setIsImporting(false)
    }
  }

  return {
    formations: sortedAndFilteredFormations,
    isLoading,
    isImporting,
    error,
    searchQuery,
    setSearchQuery,
    filiereFilter,
    setFiliereFilter,
    sortOrder,
    setSortOrder,
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
    importCSV,
  }
}
