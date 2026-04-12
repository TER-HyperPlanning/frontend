import { useState, useMemo, useEffect, useCallback } from 'react'
import { type SessionWithGroup } from '@/types/session'
import { SESSION_TYPE_LABELS, SESSION_MODE_LABELS } from '@/types/session'
import { type AddSessionValues } from '@/hooks/sessions/useAddSessionForm'
import { type EditSessionValues } from '@/hooks/sessions/useEditSessionForm'
import { useSessionService } from '@/services/sessionService'
import { useGroupService } from '@/services/groupService'

function toISO(date: string, time: string): string {
  return `${date}T${time}:00`
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === 'ApiError') return err.message
  }

  const ax = err as {
    response?: {
      data?: {
        message?: string
        detail?: string
        title?: string
        errors?: Record<string, string[]>
      }
    }
    message?: string
  }

  const d = ax.response?.data
  if (d) {
    if (typeof d.message === 'string' && d.message) return d.message
    if (typeof d.detail === 'string' && d.detail) return d.detail
    if (typeof d.title === 'string' && d.title) return d.title
    if (d.errors) {
      const first = Object.values(d.errors).flat()[0]
      if (first) return first
    }
  }

  if (typeof ax.message === 'string' && ax.message) return ax.message

  return 'Erreur inconnue'
}

export function useSessions() {
  const {
    getSessions, createSession, updateSession, deleteSession,
    createAttend, getAllAttends,
  } = useSessionService()
  const { getGroups } = useGroupService()

  const [sessions, setSessions] = useState<SessionWithGroup[]>([])
  const [groupMap, setGroupMap] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<SessionWithGroup | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SessionWithGroup | null>(null)

  const fetchSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const rawSessions = await getSessions()

      const [groups, allAttends] = await Promise.all([
        getGroups().catch(() => []),
        getAllAttends().catch(() => []),
      ])

      const gMap: Record<string, string> = {}
      for (const g of groups) gMap[g.id] = g.name
      setGroupMap(gMap)

      const attendBySession = new Map<string, string>()
      for (const a of allAttends) {
        if (!attendBySession.has(a.sessionId)) {
          attendBySession.set(a.sessionId, a.groupId)
        }
      }

      const enriched: SessionWithGroup[] = rawSessions.map((s) => {
        const gId = attendBySession.get(s.id) ?? null
        return {
          ...s,
          groupId: gId,
          groupName: gId ? (gMap[gId] ?? null) : null,
        }
      })

      setSessions(enriched)
    } catch {
      setSessions([])
    } finally {
      setIsLoading(false)
    }
  }, [getSessions, getGroups, getAllAttends])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const allGroups = useMemo(() => {
    const names = new Set<string>()
    for (const s of sessions) {
      if (s.groupName) names.add(s.groupName)
    }
    return Array.from(names).sort()
  }, [sessions])

  const filteredSessions = useMemo(() => {
    const filtered = sessions.filter((s) => {
      const matchType = typeFilter === 'all' || s.type === typeFilter
      const matchGroup = groupFilter === 'all' || s.groupName === groupFilter
      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        (s.course ?? '').toLowerCase().includes(query) ||
        (s.groupName ?? '').toLowerCase().includes(query) ||
        (s.description ?? '').toLowerCase().includes(query) ||
        SESSION_TYPE_LABELS[s.type].toLowerCase().includes(query) ||
        SESSION_MODE_LABELS[s.mode].toLowerCase().includes(query)
      return matchType && matchGroup && matchSearch
    })

    const dir = dateSort === 'asc' ? 1 : -1
    filtered.sort((a, b) =>
      dir * (new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()),
    )

    return filtered
  }, [sessions, searchQuery, typeFilter, groupFilter, dateSort])

  async function addSession(values: AddSessionValues): Promise<string | null> {
    try {
      const result = await createSession({
        startDateTime: toISO(values.startDate, values.startTime),
        endDateTime: toISO(values.endDate, values.endTime),
        mode: values.mode,
        sessionType: values.sessionType,
        courseId: values.courseId,
        sessionStatus: 'PROGRAMME',
        roomId: values.roomId,
        description: values.description,
      })

      if (values.groupId && result?.id) {
        await createAttend({ groupId: values.groupId, sessionId: result.id }).catch(() => {})
      }

      await fetchSessions()
      setIsAddModalOpen(false)
      return null
    } catch (err) {
      console.error('[addSession] error:', err)
      return extractErrorMessage(err)
    }
  }

  async function editSession(id: string, values: EditSessionValues): Promise<string | null> {
    try {
      await updateSession(id, {
        startDateTime: toISO(values.startDate, values.startTime),
        endDateTime: toISO(values.endDate, values.endTime),
        mode: values.mode,
        sessionType: values.sessionType,
        courseId: values.courseId,
        sessionStatus: 'PROGRAMME',
        roomId: values.roomId,
        description: values.description,
      })
      await fetchSessions()
      setEditTarget(null)
      return null
    } catch (err) {
      console.error('[editSession] error:', err)
      return extractErrorMessage(err)
    }
  }

  async function deleteSessionById(id: string): Promise<string | null> {
    try {
      await deleteSession(id)
      await fetchSessions()
      setDeleteTarget(null)
      return null
    } catch (err) {
      console.error('[deleteSession] error:', err)
      return extractErrorMessage(err)
    }
  }

  return {
    sessions: filteredSessions,
    isLoading,
    searchQuery, setSearchQuery,
    typeFilter, setTypeFilter,
    groupFilter, setGroupFilter,
    dateSort, setDateSort,
    allGroups, groupMap,
    isAddModalOpen,
    openAddModal: () => setIsAddModalOpen(true),
    closeAddModal: () => setIsAddModalOpen(false),
    editTarget,
    openEditModal: (session: SessionWithGroup) => setEditTarget(session),
    closeEditModal: () => setEditTarget(null),
    deleteTarget,
    openDeleteModal: (session: SessionWithGroup) => setDeleteTarget(session),
    closeDeleteModal: () => setDeleteTarget(null),
    addSession,
    editSession,
    deleteSession: deleteSessionById,
    refetch: fetchSessions,
  }
}
