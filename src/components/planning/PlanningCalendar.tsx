import { useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import type { EventContentArg } from '@fullcalendar/core'
import './planning-calendar.css'

interface PlanningCalendarProps {
  selectedDate: Date
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
      0
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7),
      17,
      30
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '2',
    title: 'Cours',
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7), // Monday
      9,
      0
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7),
      10,
      0
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '3',
    title: 'TP',
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7), // Monday
      11,
      0
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 6) % 7),
      12,
      0
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '4',
    title: 'TD',
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7) - 1, // Wednesday
      12,
      0
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7) - 1,
      13,
      0
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
  {
    id: '5',
    title: 'Revision',
    start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7), // Thursday
      14,
      0
    ),
    end: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - ((new Date().getDay() + 4) % 7),
      15,
      30
    ),
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    textColor: '#1f2937',
  },
]

function renderEventContent(eventInfo: EventContentArg) {
  const description = eventInfo.event.extendedProps?.description
  return (
    <div className="p-1.5 h-full">
      <p className="font-semibold text-sm leading-tight">{eventInfo.event.title}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
      )}
    </div>
  )
}

function PlanningCalendar({ selectedDate }: PlanningCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate)
    }
  }, [selectedDate])

  return (
    <div className="planning-calendar flex-1 overflow-auto px-1">
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
        dayHeaderFormat={{
          weekday: 'long',
          day: 'numeric',
        }}
        allDaySlot={false}
        weekends={false}
        nowIndicator={true}
        height="auto"
        events={SAMPLE_EVENTS}
        eventContent={renderEventContent}
        editable={false}
        selectable={false}
      />
    </div>
  )
}

export default PlanningCalendar
