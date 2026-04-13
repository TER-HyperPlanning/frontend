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

export interface GroupOption {
  id: string
  name: string
}

export function useSessions() {
  const {
    getSessions, createSession, updateSession, deleteSession,
    createAttend, getAllAttends, getAttendsBySession, deleteAttend,
  } = useSessionService()
  const { getGroups } = useGroupService()

  const [sessions, setSessions] = useState<SessionWithGroup[]>([])
  const [groupMap, setGroupMap] = useState<Record<string, string>>({})
  const [groupOptions, setGroupOptions] = useState<GroupOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  /** Vide = aucun groupe choisi : pas d’affichage des séances (filtre par ID, pas par nom) */
  const [selectedGroupId, setSelectedGroupId] = useState('')
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
      setGroupOptions(
        [...groups]
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
          .map((g) => ({ id: g.id, name: g.name })),
      )

      const attendsBySession = new Map<string, string[]>()
      for (const a of allAttends) {
        if (!a.sessionId || !a.groupId) continue
        const list = attendsBySession.get(a.sessionId) ?? []
        if (!list.includes(a.groupId)) list.push(a.groupId)
        attendsBySession.set(a.sessionId, list)
      }

      const enriched: SessionWithGroup[] = rawSessions.map((s) => {
        const gIds = attendsBySession.get(s.id) ?? []
        const gId = gIds[0] ?? null
        return {
          ...s,
          groupIds: gIds,
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

  const filteredSessions = useMemo(() => {
    if (!selectedGroupId) return []

    const filtered = sessions.filter((s) => {
      const matchGroup = s.groupIds.includes(selectedGroupId)
      const matchType = typeFilter === 'all' || s.type === typeFilter
      const query = searchQuery.toLowerCase().trim()
      const typeLabel = (SESSION_TYPE_LABELS as Record<string, string | undefined>)[s.type] ?? String(s.type)
      const matchSearch =
        !query ||
        (s.course ?? '').toLowerCase().includes(query) ||
        (s.groupName ?? '').toLowerCase().includes(query) ||
        (s.description ?? '').toLowerCase().includes(query) ||
        typeLabel.toLowerCase().includes(query) ||
        SESSION_MODE_LABELS[s.mode].toLowerCase().includes(query)
      return matchGroup && matchType && matchSearch
    })

    const dir = dateSort === 'asc' ? 1 : -1
    filtered.sort((a, b) =>
      dir * (new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()),
    )

    return filtered
  }, [sessions, searchQuery, typeFilter, selectedGroupId, dateSort])

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
      const attends = await getAttendsBySession(id).catch(() => [])
      for (const a of attends) {
        if (a.groupId && a.sessionId) {
          await deleteAttend(a.groupId, a.sessionId).catch(() => {})
        }
      }
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
    selectedGroupId, setSelectedGroupId,
    dateSort, setDateSort,
    groupOptions, groupMap,
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
