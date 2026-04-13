import { useState, useEffect, useCallback } from 'react'
import { type GroupModel } from '@/types/group'
import { type TrackResponse } from '@/types/formation'
import { useGroupService } from '@/services/groupService'
import { useTrackService } from '@/services/trackService'
import { useProgramService } from '@/services/programService'

export interface FormationGroupRow {
  id: string
  name: string
  academicYear: string
  trackName: string
}

export function useFormationGroups(formationId: string) {
  const { getGroups } = useGroupService()
  const { getTracks } = useTrackService()
  const { getProgramById } = useProgramService()

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
        .filter((g) => g.trackId != null && trackIds.has(g.trackId))
        .map((g) => {
          const tid = g.trackId as string
          return {
            id: g.id,
            name: g.name,
            academicYear: g.academicYear ?? '',
            trackName: trackMap.get(tid) ?? '—',
          }
        })

      setGroups(filtered)
    } catch {
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }, [formationId, getProgramById, getTracks, getGroups])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return { groups, formationName, isLoading, refetch: fetchGroups }
}
