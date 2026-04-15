import { useState, useEffect, useMemo, useCallback } from 'react'
import { useGroupService } from '@/services/groupService'
import { useTrackService } from '@/services/trackService'
import { useProgramService } from '@/services/programService'

export interface GroupRow {
  id: string
  name: string
  academicYear: string
  /** Filière (Program) */
  filiereName: string
  /** Formation (Track) */
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
        getGroups(),
        getTracks(),
        getPrograms(),
      ])

      const trackMap = new Map(allTracks.map((t) => [t.id, t]))
      const programMap = new Map(allPrograms.map((p) => [p.id, p]))

      const rows: GroupRow[] = allGroups.map((g) => {
        const track = g.trackId ? trackMap.get(g.trackId) : undefined
        const program = track?.programId ? programMap.get(track.programId) : undefined
        return {
          id: g.id,
          name: g.name,
          academicYear: g.academicYear ?? '',
          filiereName: program?.name ?? '—',
          formationName: track?.name ?? '—',
          formationId: track?.id ?? '',
        }
      })

      setGroups(rows)
    } catch (err) {
      console.error('[useGroupes] Erreur lors du chargement:', err)
      // Ne pas écraser les groupes existants en cas d'erreur de rafraîchissement
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
        g.filiereName.toLowerCase().includes(q) ||
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
