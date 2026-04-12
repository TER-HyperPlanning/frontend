import { useState, useEffect, useMemo, useCallback } from 'react'
import { type GroupModel } from '@/types/session'
import { type TrackResponse, type ProgramModel } from '@/types/formation'
import { useGroupService } from '@/services/groupService'
import { useTrackService } from '@/services/trackService'
import { useProgramService } from '@/services/programService'

export interface GroupRow {
  id: string
  name: string
  academicYear: string
  trackName: string
  formationName: string
  formationId: string
}

export function useGroupes() {
  const { getGroups } = useGroupService()
  const { getTracks } = useTrackService()
  const { getPrograms } = useProgramService()

  const [groups, setGroups] = useState<GroupRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [formationFilter, setFormationFilter] = useState('all')

  const fetchGroups = useCallback(async () => {
    setIsLoading(true)
    try {
      const [allGroups, allTracks, allPrograms] = await Promise.all([
        getGroups().catch(() => [] as GroupModel[]),
        getTracks().catch(() => [] as TrackResponse[]),
        getPrograms().catch(() => [] as ProgramModel[]),
      ])

      const trackMap = new Map(allTracks.map((t) => [t.id, t]))
      const programMap = new Map(allPrograms.map((p) => [p.id, p]))

      const rows: GroupRow[] = allGroups.map((g) => {
        const track = trackMap.get(g.trackId)
        const program = track ? programMap.get(track.programId) : undefined
        return {
          id: g.id,
          name: g.name,
          academicYear: g.academicYear,
          trackName: track?.name ?? '—',
          formationName: program?.name ?? '—',
          formationId: program?.id ?? '',
        }
      })

      setGroups(rows)
    } catch {
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }, [getGroups, getTracks, getPrograms])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const formations = useMemo(() => {
    const names = new Set<string>()
    for (const g of groups) {
      if (g.formationName && g.formationName !== '—') names.add(g.formationName)
    }
    return Array.from(names).sort()
  }, [groups])

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchFormation =
        formationFilter === 'all' || g.formationName === formationFilter
      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.trackName.toLowerCase().includes(q) ||
        g.formationName.toLowerCase().includes(q) ||
        g.academicYear.toLowerCase().includes(q)
      return matchFormation && matchSearch
    })
  }, [groups, searchTerm, formationFilter])

  return {
    groups: filteredGroups,
    isLoading,
    formations,
    searchTerm,
    setSearchTerm,
    formationFilter,
    setFormationFilter,
    refetch: fetchGroups,
  }
}
