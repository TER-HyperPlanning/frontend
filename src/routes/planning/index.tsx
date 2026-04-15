import PlanningCalendar from '@/components/planning/PlanningCalendar'
import DateStrip from '@/components/planning/DateStrip'
import PlanningHeader from '@/components/planning/PlanningHeader'
import { useCurrentUser } from '@/hooks/api/useAuth'
import { usePlanning, useMyPlanning } from '@/hooks/planning/usePlanning'
import { getAccessToken } from '@/auth/storage'
import type { PlanningFilters } from '@/types/planning'
import type { EventDropArg, EventClickArg } from '@fullcalendar/core'
import type { AddSessionValues } from '@/hooks/sessions/useAddSessionForm'
import type { EditSessionValues } from '@/hooks/sessions/useEditSessionForm'
import type { SessionWithGroup } from '@/types/session'
import type { SelectOption } from '@/types/formation'
import { useSessionService } from '@/services/sessionService'
import { useToast } from '@/hooks/useToast'
import { useCourseOptions } from '@/hooks/sessions/useCourseOptions'
import { useRoomOptions } from '@/hooks/sessions/useRoomOptions'
import Toast from '@/components/Toast'
import MainMenuContainer from '@/layout/main-menu-layout/MainMenuContainer'
import MainNavigator from '@/layout/main-menu-layout/MainNavigator'
import MainPageContainer from '@/layout/main-menu-layout/MainPageContainer'
import PageLayout from '@/layout/PageLayout'
import { getInitialDate } from '@/utils/date.utils'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback } from 'react'

export const Route = createFileRoute('/planning/')({
  component: RouteComponent,
})

function getWeekBounds(date: Date): { startDate: string; endDate: string } {
  const d = new Date(date)
  const day = d.getDay()
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1)

  const monday = new Date(d)
  monday.setDate(diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return {
    startDate: monday.toISOString(),
    endDate: sunday.toISOString(),
  }
}

function PlanningContent() {
  const [selectedDate, setSelectedDate] = useState(getInitialDate)
  const [programId, setProgramId] = useState('')
  const [trackId, setTrackId] = useState('')
  const [groupId, setGroupId] = useState('')

  // Interaction states
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<SessionWithGroup | null>(null)

  const [addSessionOpen, setAddSessionOpen] = useState(false)
  const [addSessionDefaultDate, setAddSessionDefaultDate] = useState<Date | null>(null)
  const [addSessionDateRange, setAddSessionDateRange] = useState<{ start: Date; end: Date } | null>(null)

  const [editSessionOpen, setEditSessionOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<SessionWithGroup | null>(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SessionWithGroup | null>(null)

  const [dragDropConfirmOpen, setDragDropConfirmOpen] = useState(false)
  const [dragDropData, setDragDropData] = useState<{
    eventId: string
    oldStart: Date
    oldEnd: Date
    newStart: Date
    newEnd: Date
  } | null>(null)
  const [dragDropLoading, setDragDropLoading] = useState(false)

  const { toast, showToast, hideToast } = useToast()
  const { updateSession, deleteSession, getSessionById, createSession, getAttendsBySession, deleteAttend } = useSessionService()
  const courseOptions = useCourseOptions()
  const roomOptions = useRoomOptions()

  const hasToken = !!getAccessToken()

  const weekBounds = useMemo(() => getWeekBounds(selectedDate), [selectedDate])

  const filters: PlanningFilters = useMemo(
    () => ({
      ...(groupId && { groupId }),
      ...(trackId && { trackId }),
      ...(programId && { programId }),
      startDate: weekBounds.startDate,
      endDate: weekBounds.endDate,
    }),
    [groupId, trackId, programId, weekBounds],
  )

  /** Visitors: GET /Planning. Logged-in users (any role): GET /Planning/me. */
  const fetchFullPlanning = !hasToken
  const fetchMyPlanning = hasToken

  const publicQuery = usePlanning(filters, { enabled: fetchFullPlanning })
  const personalQuery = useMyPlanning(filters, { enabled: fetchMyPlanning })
  const activeQuery = hasToken ? personalQuery : publicQuery

  // Helper: Find option value by matching name (case-insensitive partial match)
  const findOptionIdByName = useCallback(
    (options: SelectOption[], name: string | null): string => {
      if (!name) return ''
      const lower = name.toLowerCase()
      const match = options.find((o) => o.label.toLowerCase().includes(lower))
      return match?.value ?? ''
    },
    [],
  )

  // Handle double-click to add session with date range
  const handleDoubleClick = useCallback(
    (startDate: Date, endDate: Date) => {
      setAddSessionDateRange({ start: startDate, end: endDate })
      setAddSessionOpen(true)
    },
    [],
  )

  // Handle drag & drop with confirmation (validate session first)
 const handleEventDropForConfirmation = useCallback(
  async (eventId: string, oldStart: Date, oldEnd: Date, newStart: Date, newEnd: Date): Promise<void> => {
    const format = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }

    try {
      const session = await getSessionById(eventId)

      const courseId = findOptionIdByName(courseOptions, session.course)
      const roomId = findOptionIdByName(roomOptions, session.room)

      if (!courseId) throw new Error('Course introuvable')

      // 🔥 TEST backend (validation réelle)
      await updateSession(eventId, {
        startDateTime: format(newStart),
        endDateTime: format(newEnd),
        mode: session.mode,
        sessionType: session.type,
        courseId,
        sessionStatus: session.status,
        roomId,
        description: session.description || '',
      })

      // 🔁 rollback immédiat (remet ancienne valeur)
      await updateSession(eventId, {
        startDateTime: format(oldStart),
        endDateTime: format(oldEnd),
        mode: session.mode,
        sessionType: session.type,
        courseId,
        sessionStatus: session.status,
        roomId,
        description: session.description || '',
      })

      // ✅ ouvrir modal seulement si OK
      setDragDropData({
        eventId,
        oldStart,
        oldEnd,
        newStart,
        newEnd,
      })
      setDragDropConfirmOpen(true)

      return
    } catch (error: any) {
      const message =
        error?.response?.status === 409
          ? 'Groupe / professeur / salle indisponible'
          : 'Erreur lors du déplacement'

      showToast(message, 'error')

      return
    }
  },
  [
    getSessionById,
    updateSession,
    showToast,
    courseOptions,
    roomOptions,
    findOptionIdByName,
  ],
)

  // Confirm drag & drop and update
  const confirmDragDrop = useCallback(async () => {
    if (!dragDropData) return

    const { eventId, newStart, newEnd } = dragDropData

    setDragDropLoading(true)

    try {
      const session = await getSessionById(eventId)

      const courseId = findOptionIdByName(courseOptions, session.course)
      const roomId = findOptionIdByName(roomOptions, session.room)

      if (!courseId) throw new Error('Course introuvable')

      const format = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      }

      await updateSession(eventId, {
        startDateTime: format(newStart),
        endDateTime: format(newEnd),
        mode: session.mode,
        sessionType: session.type,
        courseId,
        sessionStatus: session.status,
        roomId,
        description: session.description || '',
      })

      showToast('Séance déplacée avec succès', 'success')
      setDragDropConfirmOpen(false)
      setDragDropData(null)
      activeQuery.refetch?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors du déplacement'
      showToast(message, 'error')
    } finally {
      setDragDropLoading(false)
    }
  }, [dragDropData, updateSession, getSessionById, showToast, activeQuery, courseOptions, roomOptions, findOptionIdByName])

  // Cancel drag & drop
  const cancelDragDrop = useCallback(() => {
    setDragDropConfirmOpen(false)
    setDragDropData(null)
  }, [])

  // Handle drag & drop
  const handleEventDrop = useCallback(
    async (arg: EventDropArg) => {
      const eventId = arg.event.id
      const newStart = arg.event.start
      const newEnd = arg.event.end

      if (!eventId || !newStart || !newEnd) {
        arg.revert()
        return
      }

      try {
        const session = await getSessionById(eventId)

        const courseId = findOptionIdByName(courseOptions, session.course)
        const roomId = findOptionIdByName(roomOptions, session.room)

        if (!courseId) throw new Error('Course introuvable')

        const format = (d: Date) => {
          const pad = (n: number) => String(n).padStart(2, '0')
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        }

        await updateSession(eventId, {
          startDateTime: format(newStart),
          endDateTime: format(newEnd),
          mode: session.mode,
          sessionType: session.type,
          courseId,
          sessionStatus: session.status,
          roomId,
          description: session.description || '',
        })

        showToast('Séance déplacée avec succès', 'success')
        activeQuery.refetch?.()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erreur lors du déplacement'
        showToast(message, 'error')
        arg.revert()
      }
    },
    [updateSession, getSessionById, showToast, activeQuery, courseOptions, roomOptions, findOptionIdByName],
  )



  // Handle event click
  const handleEventClick = useCallback(
    async (arg: EventClickArg) => {
      if (!arg.event.id) return

      try {
        const session = await getSessionById(arg.event.id)
        setSelectedSession(session as SessionWithGroup)
        setSessionDetailsOpen(true)
      } catch (error) {
        showToast('Erreur lors du chargement de la séance', 'error')
      }
    },
    [getSessionById, showToast],
  )

  // Open edit from details
  const handleEditFromDetails = useCallback((session: SessionWithGroup) => {
    setSelectedSession(null)
    setSessionDetailsOpen(false)
    setEditTarget(session)
    setEditSessionOpen(true)
  }, [])

  // Open delete from details
  const handleDeleteFromDetails = useCallback((session: SessionWithGroup) => {
    setSessionDetailsOpen(false)
    setDeleteTarget(session)
    setDeleteConfirmOpen(true)
  }, [])

  // Handle add session
  const handleAddSession = useCallback(
    async (values: AddSessionValues) => {
      try {
        const startDateTime = `${values.startDate}T${values.startTime}:00`
        const endDateTime = `${values.endDate}T${values.endTime}:00`

        const createData = {
          startDateTime,
          endDateTime,
          mode: values.mode,
          sessionType: values.sessionType,
          courseId: values.courseId,
          sessionStatus: 'PROGRAMME' as const,
          roomId: values.roomId || '',
          description: values.description,
        }

        console.log('[handleAddSession] Creating session', { payload: createData })

        const createdSession = await createSession(createData)

        console.log('[handleAddSession] Created successfully', { id: createdSession.id })

        showToast('Séance créée avec succès', 'success')
        setAddSessionOpen(false)
        setAddSessionDefaultDate(null)
        activeQuery.refetch?.()
        return true
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erreur lors de la création'
        console.error('[handleAddSession] Error:', message, error)
        showToast(message, 'error')
        return false
      }
    },
    [showToast, activeQuery, createSession],
  )

  // Handle edit session
  const handleEditSession = useCallback(
    async (values: EditSessionValues) => {
      if (!editTarget) return false

      try {
        await updateSession(editTarget.id, {
          startDateTime: `${values.startDate}T${values.startTime}:00`,
          endDateTime: `${values.endDate}T${values.endTime}:00`,
          mode: values.mode,
          sessionType: values.sessionType,
          courseId: values.courseId,
          sessionStatus: 'PROGRAMME',
          roomId: values.roomId,
          description: values.description,
        })

        showToast('Séance modifiée avec succès', 'success')
        setEditSessionOpen(false)
        setEditTarget(null)
        activeQuery.refetch?.()
        return true
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erreur lors de la modification'
        showToast(message, 'error')
        return false
      }
    },
    [editTarget, showToast, activeQuery, updateSession],
  )

  // Handle delete session
  const handleDeleteSession = useCallback(async () => {
    if (!deleteTarget) return

    try {
      const attends = await getAttendsBySession(deleteTarget.id).catch(() => [])

      for (const a of attends) {
        if (a.groupId && a.sessionId) {
          await deleteAttend(a.groupId, a.sessionId).catch(() => {})
        }
      }

      await deleteSession(deleteTarget.id)

      showToast('Séance supprimée avec succès', 'success')
      setDeleteConfirmOpen(false)
      setDeleteTarget(null)
      activeQuery.refetch?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la suppression'
      showToast(message, 'error')
    }
  }, [deleteTarget, deleteSession, showToast, activeQuery, getAttendsBySession, deleteAttend])

  return (
    <PageLayout className="flex flex-col">
      <PlanningHeader
        programId={programId}
        trackId={trackId}
        groupId={groupId}
        onProgramChange={setProgramId}
        onTrackChange={setTrackId}
        onGroupChange={setGroupId}
      />
      <DateStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <PlanningCalendar
        selectedDate={selectedDate}
        events={activeQuery.data ?? []}
        isLoading={activeQuery.isLoading}
        onEventDrop={handleEventDrop}
        onEventClick={handleEventClick}
        onDoubleClick={handleDoubleClick}
        onEventDropForConfirmation={handleEventDropForConfirmation}
        dragDropConfirmOpen={dragDropConfirmOpen}
        dragDropData={
          dragDropData
            ? {
                originalStart: dragDropData.oldStart,
                originalEnd: dragDropData.oldEnd,
                newStart: dragDropData.newStart,
                newEnd: dragDropData.newEnd,
              }
            : null
        }
        dragDropLoading={dragDropLoading}
        dragDropError={null}
        onConfirmDragDrop={confirmDragDrop}
        onCancelDragDrop={cancelDragDrop}
        sessionDetailsOpen={sessionDetailsOpen}
        selectedSession={selectedSession}
        onCloseSessionDetails={() => setSessionDetailsOpen(false)}
        onEditSession={handleEditFromDetails}
        onDeleteSessionFromDetails={handleDeleteFromDetails}
        addSessionOpen={addSessionOpen}
        addSessionDefaultDate={addSessionDefaultDate}
        addSessionDateRange={addSessionDateRange}
        onCloseAddSession={() => {
          setAddSessionOpen(false)
          setAddSessionDefaultDate(null)
          setAddSessionDateRange(null)
        }}
        onAddSession={handleAddSession}
        editSessionOpen={editSessionOpen}
        editTarget={editTarget}
        onCloseEditSession={() => {
          setEditSessionOpen(false)
          setEditTarget(null)
        }}
        onEditSession2={handleEditSession}
        deleteConfirmOpen={deleteConfirmOpen}
        deleteTarget={deleteTarget}
        onCloseDeleteConfirm={() => {
          setDeleteConfirmOpen(false)
          setDeleteTarget(null)
        }}
        onConfirmDelete={handleDeleteSession}
      />
      <Toast toast={toast} onClose={hideToast} />
    </PageLayout>
  )
}

function RouteComponent() {
  const { data: user } = useCurrentUser()

  if (!user || user.role === 'STUDENT') {
    return <PlanningContent />
  }

  return (
    <MainMenuContainer>
      <MainNavigator />
      <MainPageContainer>
        <PlanningContent />
      </MainPageContainer>
    </MainMenuContainer>
  )
}

