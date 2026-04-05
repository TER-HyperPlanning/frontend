import { useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import type { EventInput, EventContentArg, DayHeaderContentArg } from '@fullcalendar/core'
import './planning-calendar.css'

interface PlanningCalendarProps {
  selectedDate: Date
  events?: EventInput[]
  isLoading?: boolean
}

function renderEventContent(eventInfo: EventContentArg) {
  const { room, course, description } = eventInfo.event.extendedProps ?? {}
  const subtitle = [course, room].filter(Boolean).join(' · ')
  return (
    <div className="p-1.5 h-full">
      <p className="font-semibold text-sm leading-tight">{eventInfo.event.title}</p>
      {subtitle && (
        <p className="text-xs opacity-75 mt-0.5 truncate">{subtitle}</p>
      )}
      {description && (
        <p className="text-xs opacity-60 mt-0.5 truncate">{description}</p>
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

function PlanningCalendar({ selectedDate, events = [], isLoading }: PlanningCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate)
    }
  }, [selectedDate])

  return (
    <div className="planning-calendar flex-1 overflow-auto px-1 relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}
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
          events={events}
          eventContent={renderEventContent}
          editable={false}
          selectable={false}
        />
      </div>
    </div>
  )
}

export default PlanningCalendar
