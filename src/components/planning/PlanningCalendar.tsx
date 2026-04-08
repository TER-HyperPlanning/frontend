import { useRef, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import type { EventContentArg, DayHeaderContentArg, EventApi } from '@fullcalendar/core'
import './planning-calendar.css'
import { SessionDetailsModal } from './SessionDetailsModal'
import { ConfirmChangeModal } from './ConfirmChangeModal'
import { useToast } from '@/hooks/useToast'

// // ✅ IMPORT MOCK API
// import {
//   getSessions,
//   requestReschedule,
// } from '@/hooks/api/mock/sessionApi'

interface PlanningCalendarProps {
  selectedDate: Date
}

// Availability logic (mock)
const isSlotAvailable = (date: Date): boolean => {
  const hour = date.getHours()
  return hour >= 10 && hour < 16
}

// Sample events to match the mockup
const SAMPLE_EVENTS = [
  {
    id: '1',
    title: 'TD 02',
    extendedProps: { description: 'Implementation de ..' },
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7), // Thursday
      16,
      0,
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7),
      17,
      30,
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '2',
    title: 'Cours',
    extendedProps: { description: 'Cours magistral - Chapitre 3' },
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7), // Monday
      9,
      0,
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7),
      10,
      0,
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '3',
    title: 'TP',
    extendedProps: { description: 'Travaux pratiques - Lab 2' },
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7), // Monday
      11,
      0,
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7),
      12,
      0,
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '4',
    title: 'TD',
    extendedProps: { description: 'Travaux dirigés - Exercices' },
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7) - 1, // Wednesday
      12,
      0,
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7) - 1,
      13,
      0,
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '5',
    title: 'Revision',
    extendedProps: { description: 'Séance de révision' },
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7), // Thursday
      14,
      0,
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7),
      15,
      30,
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
]

function renderEventContent(eventInfo: EventContentArg) {
  const description = eventInfo.event.extendedProps?.description
  const status = eventInfo.event.extendedProps?.status
  return (
    <div className="p-1.5 h-full flex flex-col justify-between">
      <div>
        <p className="font-semibold text-sm leading-tight">
          {eventInfo.event.title}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
        )}
      </div>
      {status === 'pending' && (
        <div className="flex items-center gap-1 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⏳ En attente
          </span>
        </div>
      )}
    </div>
  )
}

function renderDayHeader(arg: DayHeaderContentArg) {
  return (
    <div className="flex flex-col items-center w-full">
      <span className="text-xs font-semibold day-name capitalize tracking-wide">
        {arg.date.toLocaleDateString('fr-FR', { weekday: 'long' })}
      </span>
      <span className="text-2xl font-bold leading-none mt-1 day-number">
        {arg.date.getDate()}
      </span>
    </div>
  )
}

function PlanningCalendar({ selectedDate }: PlanningCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const [selectedSession, setSelectedSession] = useState<EventApi | null>(null)
  const [draggingEvent, setDraggingEvent] = useState<EventApi | null>(null)
  const [pendingChange, setPendingChange] = useState<{
    event: EventApi
    oldStart: Date | null
    newStart: Date | null
  } | null>(null)
  const { toast, showToast } = useToast()

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate)
    }
  }, [selectedDate])

  // Handle event click to show details
  const handleEventClick = (info: any) => {
    console.log('clicked event', info.event)
    setSelectedSession(info.event)
  }

  // Track when dragging starts
  const handleEventDragStart = (info: any) => {
    console.log('drag start', info.event.title)
    setDraggingEvent(info.event)
  }

  // Reset drag state when dragging stops
  const handleEventDragStop = (info: any) => {
    console.log('drag stop', info.event.title)
    setDraggingEvent(null)
  }

  // Handle drop with validation
  const handleEventDrop = (info: any) => {
    const newStart = info.event.start
    const oldStart = info.oldEvent.start

    console.log('event dropped', {
      title: info.event.title,
      oldStart,
      newStart,
    })

    // Check if new slot is available
    if (!isSlotAvailable(newStart)) {
      console.log('slot not available, reverting')
      info.revert()
      showToast('Créneaux disponibles: 10:00 - 16:00', 'error')
      return
    }

    // Store pending change and show confirmation modal
    setPendingChange({
      event: info.event,
      oldStart,
      newStart,
    })
  }

  // Handle confirmation of change
  const handleConfirmChange = () => {
    if (pendingChange && pendingChange.event) {
      // Update event status to pending
      pendingChange.event.setExtendedProp('status', 'pending')
      showToast('Demande envoyée à la scolarité', 'success')
      setPendingChange(null)
    }
  }

  // Handle cancellation of change
  const handleCancelChange = () => {
    if (pendingChange && calendarRef.current) {
      // Revert the event to original position
      const event = calendarRef.current
        .getApi()
        .getEventById(pendingChange.event.id)
      if (event && pendingChange.oldStart) {
        event.setStart(pendingChange.oldStart)
      }
    }
    setPendingChange(null)
  }

  // Handle event update from modal
  const handleEventUpdate = (eventId: string, status: string) => {
    if (calendarRef.current) {
      const event = calendarRef.current
        .getApi()
        .getEventById(eventId)
      if (event) {
        event.setExtendedProp('status', status)
      }
    }
  }

  return (
    <div className="planning-calendar flex-1 overflow-auto px-1">
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
          slotDuration="01:00:00"
          slotLabelInterval="01:00:00"
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
          }}
          dayHeaderContent={renderDayHeader}
          allDaySlot={false}
          weekends={false}
          nowIndicator={true}
          height="auto"
          events={SAMPLE_EVENTS}
          eventContent={renderEventContent}
          editable={true}
          droppable={true}
          eventDurationEditable={false}
          eventClick={handleEventClick}
          eventDragStart={handleEventDragStart}
          eventDragStop={handleEventDragStop}
          eventDrop={handleEventDrop}
          eventClassNames={(arg: any) => {
            const classes = []
            // Add pending status class
            if (arg.event.extendedProps?.status === 'pending') {
              classes.push('opacity-60')
            }
            return classes
          }}
        />
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          event={selectedSession}
          onClose={() => setSelectedSession(null)}
          onEventUpdate={handleEventUpdate}
        />
      )}

      {/* Confirm Change Modal */}
      {pendingChange && pendingChange.oldStart && pendingChange.newStart && (
        <ConfirmChangeModal
          oldDate={pendingChange.oldStart}
          newDate={pendingChange.newStart}
          onConfirm={handleConfirmChange}
          onCancel={handleCancelChange}
        />
      )}
    </div>
  )
}

export default PlanningCalendar
