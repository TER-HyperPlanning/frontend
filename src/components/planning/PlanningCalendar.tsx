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

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    description?: string
    status: 'active' | 'pending' | 'absent'
    teacherId: string
    groupId: string
    teacherName: string
    group: string
    room?: string
    remarks?: string
    studentsCount?: number
    equipment?: string[]
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
  const description = eventInfo.event.extendedProps?.description as string | undefined
  const status = eventInfo.event.extendedProps?.status as
    | 'active'
    | 'pending'
    | 'absent'
    | undefined

  return (
    <div className="p-1.5 h-full flex flex-col justify-between overflow-hidden">
      <div className="min-w-0">
        <p className="font-semibold text-sm leading-tight truncate">
          {eventInfo.event.title}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
        )}
      </div>

      {status === 'pending' && (
        <div className="flex items-center gap-1 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-100 text-yellow-800">
            En attente
          </span>
        </div>
      )}

      {status === 'absent' && (
        <div className="flex items-center gap-1 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-100 text-red-700">
            Absence
          </span>
        </div>
      )}
    </div>
  )
}

function renderDayHeader(arg: DayHeaderContentArg) {
  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-xs font-semibold capitalize tracking-wide">
        {arg.date.toLocaleDateString('fr-FR', { weekday: 'long' })}
      </span>
      <span className="text-2xl font-bold leading-none mt-1">
        {arg.date.getDate()}
      </span>
    </div>
  )
}

function mapSessionsToEvents(sessions: Awaited<ReturnType<typeof getSessions>>): CalendarEvent[] {
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
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate)
    }
  }, [selectedDate])

  const clearError = () => {
    setGlobalError(null)
  }

  const handleEventMouseEnter = (info: EventMouseEnterArg) => {
    setHoveredEventId(info.event.id)
    const rect = info.el.getBoundingClientRect()
    setTooltipPos({
      x: rect.right + 10,
      y: rect.top,
    })
  }

  const handleEventMouseLeave = (_info: EventMouseLeaveArg) => {
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

    clearError()

    const newStart = info.event.start
    const newEnd = info.event.end
    const oldStart = info.oldEvent.start
    const oldEnd = info.oldEvent.end

    if (!newStart || !newEnd || !oldStart || !oldEnd) {
      info.revert()
      setGlobalError('Impossible de déplacer cette séance.')
      return
    }

    const validation = checkRescheduleAvailability(info.event.id, newStart, newEnd)

    if (!validation.ok) {
      info.revert()
      setGlobalError(validation.reason || 'Créneau non disponible.')
      showToast(validation.reason || 'Créneau non disponible.', 'error')
      return
    }

    setPendingChange({
      eventId: info.event.id,
      eventTitle: info.event.title,
      oldStart,
      oldEnd,
      newStart,
      newEnd,
    })
  }

  const handleConfirmChange = async () => {
    if (!pendingChange) return

    setIsConfirmingChange(true)
    clearError()

    try {
      const success =
        userRole === 'admin'
          ? await adminRescheduleSession(
              pendingChange.eventId,
              pendingChange.newStart,
              pendingChange.newEnd,
            )
          : await requestReschedule(
              pendingChange.eventId,
              pendingChange.newStart,
              pendingChange.newEnd,
            )

      if (!success) {
        const calendarApi = calendarRef.current?.getApi()
        const event = calendarApi?.getEventById(pendingChange.eventId)

        if (event) {
          event.setStart(pendingChange.oldStart)
          event.setEnd(pendingChange.oldEnd)
        }

        setGlobalError('Créneau non disponible. Le déplacement a été annulé.')
        showToast('Créneau non disponible.', 'error')
        setPendingChange(null)
        return
      }

      await loadSessions()
      showToast(
        userRole === 'admin'
          ? 'Séance déplacée avec succès.'
          : 'Demande de changement envoyée à la scolarité.',
        'success',
      )
      setPendingChange(null)
    } finally {
      setIsConfirmingChange(false)
    }
  }

  const handleCancelChange = () => {
    if (!pendingChange) return

    const calendarApi = calendarRef.current?.getApi()
    const event = calendarApi?.getEventById(pendingChange.eventId)

    if (event) {
      event.setStart(pendingChange.oldStart)
      event.setEnd(pendingChange.oldEnd)
    }

    setPendingChange(null)
  }

  return (
    <div className="planning-calendar flex-1 overflow-auto px-1">
      <div className="mb-3 flex items-center justify-between gap-3">
        {globalError ? (
          <div className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {globalError}
          </div>
        ) : (
          <div />
        )}

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              clearError()
              setIsCreateSessionOpen(true)
            }}
            className="shrink-0 rounded-lg bg-[#003A68] px-4 py-2 text-sm font-medium text-white hover:bg-[#002847]"
          >
            Ajouter une séance
          </button>
        )}
      </div>

      <div className="min-w-[700px] h-full">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          locale={frLocale}
          initialView="timeGridWeek"
          initialDate={selectedDate}
          headerToolbar={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
          }}
          dayHeaderContent={renderDayHeader}
          allDaySlot={false}
          weekends={false}
          nowIndicator
          height="auto"
          events={events}
          eventContent={renderEventContent}
          editable={canDrag}
          droppable={false}
          eventDurationEditable={false}
          eventStartEditable={canDrag}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          eventClassNames={(arg) => {
            const classes: string[] = []
            const status = arg.event.extendedProps?.status as string | undefined

            if (status === 'pending') {
              classes.push('opacity-90')
            }

            if (status === 'absent') {
              classes.push('opacity-80')
            }

            if (hoveredEventId === arg.event.id) {
              classes.push('shadow-lg')
            }

            return classes
          }}
        />
      </div>

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
          onCancel={handleCancelChange}
          userRole={userRole}
          isLoading={isConfirmingChange}
        />
      )}

      {isCreateSessionOpen && (
        <CreateSessionModal
          onClose={() => setIsCreateSessionOpen(false)}
          onCreated={async () => {
            setGlobalError(null)
            setIsCreateSessionOpen(false)
            await loadSessions()
            showToast('Séance ajoutée avec succès.', 'success')
          }}
          onTopError={setGlobalError}
        />
      )}

      {isLoading && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm shadow">
          Chargement...
        </div>
      )}
    </div>
  )
}

export default PlanningCalendar