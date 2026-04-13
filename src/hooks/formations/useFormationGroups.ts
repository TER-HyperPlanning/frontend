import { useState, useEffect, useCallback } from 'react'
import { type GroupModel } from '@/types/group'
import { useGroupService } from '@/services/groupService'
import { useTrackService } from '@/services/trackService'
import { useProgramService } from '@/services/programService'

export interface FormationGroupRow {
  id: string
  name: string
  academicYear: string
  /** Filière (Program) */
  filiereName: string
}

export function useFormationGroups(formationId: string) {
  const { getGroups } = useGroupService()
  const { getTrackById } = useTrackService()
  const { getProgramById } = useProgramService()

  const [groups, setGroups] = useState<FormationGroupRow[]>([])
  const [formationName, setFormationName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchGroups = useCallback(async () => {
    setIsLoading(true)
    try {
      const track = await getTrackById(formationId).catch(() => null)
      const program = track?.programId
        ? await getProgramById(track.programId).catch(() => null)
        : null

      setFormationName(track?.name ?? '')

      const allGroups = await getGroups().catch(() => [] as GroupModel[])
      const filiereLabel = program?.name ?? '—'

      const filtered = allGroups
        .filter((g) => g.trackId === formationId)
        .map((g) => ({
          id: g.id,
          name: g.name,
          academicYear: g.academicYear ?? '',
          filiereName: filiereLabel,
        }))

      setGroups(filtered)
    } catch {
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }, [formationId, getTrackById, getProgramById, getGroups])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return { groups, formationName, isLoading, refetch: fetchGroups }
}
