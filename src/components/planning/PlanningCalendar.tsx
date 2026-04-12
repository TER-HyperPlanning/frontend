import { useRef, useEffect, useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import type {
  EventClickArg,
  EventContentArg,
  EventDropArg,
  DayHeaderContentArg,
  EventMouseEnterArg,
  EventMouseLeaveArg,
} from '@fullcalendar/core'

import './planning-calendar.css'
import { SessionDetailsModal } from './SessionDetailsModal'
import { ConfirmChangeModal } from './ConfirmChangeModal'
import { SessionTooltip } from './SessionTooltip'
import { CreateSessionModal } from './CreateSessionModal'
import { useToast } from '@/hooks/useToast'
import { useUserRole } from '@/hooks/useUserRole'
import {
  getSessions,
  requestReschedule,
  adminRescheduleSession,
  checkRescheduleAvailability,
} from '@/hooks/api/mock/sessionApi'

interface PlanningCalendarProps {
  selectedDate: Date
}

/* ================= TYPES ================= */

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    status: 'active' | 'pending' | 'absent'
    teacherId: string
    groupId: string
    teacherName: string
    group: string
    room?: string
    studentsCount?: number
  }
}

interface PendingChangeState {
  eventId: string
  eventTitle: string
  oldStart: Date
  oldEnd: Date
  newStart: Date
  newEnd: Date
}

/* ================= HELPERS ================= */

function getEventColors(status: 'active' | 'pending' | 'absent') {
  if (status === 'pending') {
    return {
      backgroundColor: '#FEF3C7',
      borderColor: '#F59E0B',
      textColor: '#92400E',
    }
  }

  if (status === 'absent') {
    return {
      backgroundColor: '#FEE2E2',
      borderColor: '#EF4444',
      textColor: '#991B1B',
    }
  }

  return {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    textColor: '#1F2937',
  }
}

function renderEventContent(eventInfo: EventContentArg) {
  const { room, description } = eventInfo.event.extendedProps ?? {}

  return (
    <div className="p-1.5 h-full flex flex-col justify-between overflow-hidden">
      <div className="min-w-0">
        <p className="font-semibold text-sm truncate">
          {eventInfo.event.title}
        </p>

        {room && (
          <p className="text-xs opacity-70 truncate">{room}</p>
        )}

        {description && (
          <p className="text-xs opacity-60 truncate">{description}</p>
        )}
      </div>
    </div>
  )
}

function renderDayHeader(arg: DayHeaderContentArg) {
  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-xs font-semibold capitalize">
        {arg.date.toLocaleDateString('fr-FR', { weekday: 'long' })}
      </span>
      <span className="text-2xl font-bold">
        {arg.date.getDate()}
      </span>
    </div>
  )
}

function mapSessionsToEvents(
  sessions: Awaited<ReturnType<typeof getSessions>>
): CalendarEvent[] {
  return sessions.map((session) => {
    const colors = getEventColors(session.status)

    return {
      id: session.id,
      title: session.title,
      start: session.start,
      end: session.end,
      ...colors,
      extendedProps: {
        status: session.status,
        teacherId: session.teacherId,
        groupId: session.groupId,
        teacherName: session.teacherName,
        group: session.group,
        room: session.room,
        studentsCount: session.studentsCount,
      },
    }
  })
}

/* ================= COMPONENT ================= */

function PlanningCalendar({ selectedDate }: PlanningCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const [pendingChange, setPendingChange] = useState<PendingChangeState | null>(null)
  const [isConfirmingChange, setIsConfirmingChange] = useState(false)

  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false)

  const { showToast } = useToast()
  const userRole = useUserRole()

  const canDrag = userRole === 'enseignant' || userRole === 'admin'
  const isAdmin = userRole === 'admin'

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const sessions = await getSessions()
      setEvents(mapSessionsToEvents(sessions))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(selectedDate)
  }, [selectedDate])

  const clearError = () => setGlobalError(null)

  const handleEventMouseEnter = (info: EventMouseEnterArg) => {
    setHoveredEventId(info.event.id)

    const rect = info.el.getBoundingClientRect()
    setTooltipPos({
      x: rect.right + 10,
      y: rect.top,
    })
  }

  const handleEventMouseLeave = (_: EventMouseLeaveArg) => {
    setHoveredEventId(null)
    setTooltipPos(null)
  }

  const handleEventClick = (info: EventClickArg) => {
    clearError()
    setSelectedSessionId(info.event.id)
  }

  const handleEventDrop = (info: EventDropArg) => {
    if (!canDrag) {
      info.revert()
      return
    }

    const { start, end } = info.event
    const { start: oldStart, end: oldEnd } = info.oldEvent

    if (!start || !end || !oldStart || !oldEnd) {
      info.revert()
      return
    }

    const validation = checkRescheduleAvailability(info.event.id, start, end)

    if (!validation.ok) {
      info.revert()
      showToast(validation.reason || 'Créneau non disponible', 'error')
      return
    }

    setPendingChange({
      eventId: info.event.id,
      eventTitle: info.event.title,
      oldStart,
      oldEnd,
      newStart: start,
      newEnd: end,
    })
  }

  const handleConfirmChange = async () => {
    if (!pendingChange) return

    setIsConfirmingChange(true)

    try {
      const success =
        userRole === 'admin'
          ? await adminRescheduleSession(
              pendingChange.eventId,
              pendingChange.newStart,
              pendingChange.newEnd
            )
          : await requestReschedule(
              pendingChange.eventId,
              pendingChange.newStart,
              pendingChange.newEnd
            )

      if (!success) {
        showToast('Créneau non disponible', 'error')
        return
      }

      await loadSessions()
      showToast('Séance mise à jour', 'success')
      setPendingChange(null)
    } finally {
      setIsConfirmingChange(false)
    }
  }

  return (
    <div className="planning-calendar flex-1 overflow-auto px-1">

      {isAdmin && (
        <button
          onClick={() => setIsCreateSessionOpen(true)}
          className="mb-3 px-4 py-2 bg-[#003A68] text-white rounded"
        >
          Ajouter une séance
        </button>
      )}

      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        locale={frLocale}
        initialView="timeGridWeek"
        events={events}
        eventContent={renderEventContent}
        editable={canDrag}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
      />

      {hoveredEventId && tooltipPos && (
        <SessionTooltip
          sessionId={hoveredEventId}
          x={tooltipPos.x}
          y={tooltipPos.y}
        />
      )}

      {selectedSessionId && (
        <SessionDetailsModal
          sessionId={selectedSessionId}
          userRole={userRole}
          onClose={() => setSelectedSessionId(null)}
          onSessionChange={loadSessions}
          onTopError={setGlobalError}
        />
      )}

      {pendingChange && (
        <ConfirmChangeModal
          title={pendingChange.eventTitle}
          oldDate={pendingChange.oldStart}
          newDate={pendingChange.newStart}
          onConfirm={handleConfirmChange}
          onCancel={() => setPendingChange(null)}
          userRole={userRole}
          isLoading={isConfirmingChange}
        />
      )}

      {isCreateSessionOpen && (
        <CreateSessionModal
          onClose={() => setIsCreateSessionOpen(false)}
          onCreated={loadSessions}
          onTopError={setGlobalError}
        />
      )}
    </div>
  )
}

export default PlanningCalendar