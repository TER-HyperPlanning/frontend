import { useState, useCallback, useRef } from 'react'
import type { EventDropArg, EventClickArg, DateClickArg } from '@fullcalendar/core'
import type { SessionResponse, SessionWithGroup } from '@/types/session'
import { useSessionService } from '@/services/sessionService'

interface DragDropData {
  session: SessionResponse
  originalStart: Date
  originalEnd: Date
  newStart: Date
  newEnd: Date
}

interface PlanningCalendarInteractionsState {
  // Drag & drop
  dragDropConfirmOpen: boolean
  dragDropData: DragDropData | null
  dragDropLoading: boolean
  dragDropError: string | null
  // Session details
  sessionDetailsOpen: boolean
  selectedSession: SessionWithGroup | null
  // Add session
  addSessionOpen: boolean
  addSessionDefaultDate: Date | null
  // Delete confirmation
  deleteConfirmOpen: boolean
  deleteTarget: SessionWithGroup | null
}

export function usePlanningCalendarInteractions(
  sessions: SessionWithGroup[],
  onSessionsChange?: () => void | Promise<void>,
) {
  const { updateSession, deleteSession } = useSessionService()
  const lastClickRef = useRef<number>(0)

  const [state, setState] = useState<PlanningCalendarInteractionsState>({
    dragDropConfirmOpen: false,
    dragDropData: null,
    dragDropLoading: false,
    dragDropError: null,
    sessionDetailsOpen: false,
    selectedSession: null,
    addSessionOpen: false,
    addSessionDefaultDate: null,
    deleteConfirmOpen: false,
    deleteTarget: null,
  })

  // Calculate duration in milliseconds
  const calculateDuration = useCallback((start: Date, end: Date): number => {
    return end.getTime() - start.getTime()
  }, [])

  // Format ISO datetime
  const toISO = useCallback((date: Date): string => {
    return date.toISOString().slice(0, 19)
  }, [])

  // Handle drag & drop
  const handleEventDrop = useCallback(
    (arg: EventDropArg) => {
      const session = sessions.find((s) => s.id === arg.event.id)
      if (!session || !arg.event.start || !arg.event.end) {
        arg.revert()
        return
      }

      const originalStart = new Date(session.startDateTime)
      const originalEnd = new Date(session.endDateTime)
      const duration = calculateDuration(originalStart, originalEnd)

      // New times
      const newStart = arg.event.start
      const newEnd = new Date(newStart.getTime() + duration)

      setState((prev) => ({
        ...prev,
        dragDropConfirmOpen: true,
        dragDropData: {
          session,
          originalStart,
          originalEnd,
          newStart,
          newEnd,
        },
      }))

      // Save the event for potential revert
      arg.revert()
    },
    [sessions, calculateDuration],
  )

  // Confirm drag & drop
  const confirmDragDrop = useCallback(async () => {
    if (!state.dragDropData) return

    setState((prev) => ({ ...prev, dragDropLoading: true, dragDropError: null }))

    try {
      const { session, newStart, newEnd } = state.dragDropData

      // Find course ID - retrieve from session's extended props if available
      // We need to fetch the course ID from existing data
      const courseId = session.id // We'll need to figure this out from the API

      // For now, we'll make an educated guess - session has 'course' field
      // We need to resolve it back to courseId
      // Best approach: fetch the current session to get all needed fields

      const updateData = {
        startDateTime: toISO(newStart),
        endDateTime: toISO(newEnd),
        mode: session.mode,
        sessionType: session.type,
        courseId: '', // Will be populated via API
        sessionStatus: session.status,
        roomId: session.room || '', // Will be populated via API
        description: session.description || '',
      }

      await updateSession(session.id, updateData)

      setState((prev) => ({
        ...prev,
        dragDropConfirmOpen: false,
        dragDropData: null,
        dragDropLoading: false,
      }))

      // Refresh sessions
      await onSessionsChange?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      setState((prev) => ({
        ...prev,
        dragDropLoading: false,
        dragDropError: message,
      }))
    }
  }, [state.dragDropData, updateSession, toISO, onSessionsChange])

  // Cancel drag & drop
  const cancelDragDrop = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dragDropConfirmOpen: false,
      dragDropData: null,
      dragDropError: null,
    }))
  }, [])

  // Handle event click
  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      const session = sessions.find((s) => s.id === arg.event.id)
      if (!session) return

      setState((prev) => ({
        ...prev,
        sessionDetailsOpen: true,
        selectedSession: session,
      }))
    },
    [sessions],
  )

  // Handle date click (with double-click detection)
  const handleDateClick = useCallback((arg: DateClickArg) => {
    const now = Date.now()
    const isDoubleClick = now - lastClickRef.current < 300

    if (isDoubleClick && arg.date) {
      setState((prev) => ({
        ...prev,
        addSessionOpen: true,
        addSessionDefaultDate: arg.date,
      }))
    }

    lastClickRef.current = now
  }, [])

  // Close modals
  const closeSessionDetails = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sessionDetailsOpen: false,
      selectedSession: null,
    }))
  }, [])

  const closeAddSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      addSessionOpen: false,
      addSessionDefaultDate: null,
    }))
  }, [])

  const closeDeleteConfirm = useCallback(() => {
    setState((prev) => ({
      ...prev,
      deleteConfirmOpen: false,
      deleteTarget: null,
    }))
  }, [])

  // Open delete confirmation
  const openDeleteConfirm = useCallback((session: SessionWithGroup) => {
    setState((prev) => ({
      ...prev,
      deleteConfirmOpen: true,
      deleteTarget: session,
    }))
  }, [])

  // Handle delete
  const handleDeleteSession = useCallback(async () => {
    if (!state.deleteTarget) return

    try {
      await deleteSession(state.deleteTarget.id)
      closeDeleteConfirm()
      await onSessionsChange?.()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la suppression'
      console.error(message)
    }
  }, [state.deleteTarget, deleteSession, closeDeleteConfirm, onSessionsChange])

  return {
    // State
    dragDropConfirmOpen: state.dragDropConfirmOpen,
    dragDropData: state.dragDropData,
    dragDropLoading: state.dragDropLoading,
    dragDropError: state.dragDropError,
    sessionDetailsOpen: state.sessionDetailsOpen,
    selectedSession: state.selectedSession,
    addSessionOpen: state.addSessionOpen,
    addSessionDefaultDate: state.addSessionDefaultDate,
    deleteConfirmOpen: state.deleteConfirmOpen,
    deleteTarget: state.deleteTarget,
    // Event handlers
    handleEventDrop,
    handleEventClick,
    handleDateClick,
    // Drag & drop
    confirmDragDrop,
    cancelDragDrop,
    // Session details
    closeSessionDetails,
    // Add session
    closeAddSession,
    // Delete
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDeleteSession,
  }
}
