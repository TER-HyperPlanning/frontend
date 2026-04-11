import { useState, useEffect, useCallback } from 'react'
import { type GroupModel } from '@/types/formation'
import { type TrackResponse } from '@/types/formation'
import { getGroups } from '@/services/groupService'
import { getTracks } from '@/services/trackService'
import { getProgramById } from '@/services/programService'

export interface FormationGroupRow {
  id: string
  name: string
  academicYear: string
  trackId: string
  trackName: string
  programId: string
  formationName: string
}

export function useFormationGroups(formationId: string) {

  const [groups, setGroups] = useState<FormationGroupRow[]>([])
  const [formationName, setFormationName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchGroups = useCallback(async () => {
    setIsLoading(true)
    try {
      const [program, allTracks, allGroups] = await Promise.all([
        getProgramById(formationId).catch(() => null),
        getTracks().catch(() => [] as TrackResponse[]),
        getGroups().catch(() => [] as GroupModel[]),
      ])

      setFormationName(program?.name ?? '')

      const trackIds = new Set(
        allTracks.filter((t) => t.programId === formationId).map((t) => t.id),
      )
      const trackMap = new Map(allTracks.map((t) => [t.id, t.name]))

      const filtered = allGroups
        .filter((g) => trackIds.has(g.trackId))
        .map((g) => ({
          id: g.id,
          name: g.name,
          academicYear: g.academicYear,
          trackId: g.trackId,
          trackName: trackMap.get(g.trackId) ?? '—',
          programId: program?.id ?? '',
          formationName: program?.name ?? '—',
        }))

      setGroups(filtered)
    } catch {
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }, [formationId])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return { groups, formationName, isLoading, refetch: fetchGroups }
}
