import { useRef, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import type { EventClickArg, EventContentArg, DayHeaderContentArg } from '@fullcalendar/core'
import SeanceDetailsModal from '../seance-details/SeanceDetailsModal'
import { detailsSeanceFromPlanningLike } from '../seance-details/types'
import type { DetailsSeance } from '../seance-details/types'
import './planning-calendar.css'

interface PlanningCalendarProps {
  selectedDate: Date
}

// Sample events to match the mockup
const SAMPLE_EVENTS = [
  {
    id: '1',
    title: 'TD 02',
    extendedProps: {
      description: 'Implementation de ..',
      module: 'Algorithmique',
      groupe: 'Groupe A',
      enseignant: 'M. Dupont',
      salle: 'S101',
      batiment: 'Bâtiment A',
      typeSeance: 'Travaux dirigés',
    },
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
    extendedProps: {
      description: 'Cours magistral sur la gestion de projet.',
      module: 'Management',
      groupe: 'Groupe B',
      enseignant: 'Mme Martin',
      salle: 'A201',
      batiment: 'Bâtiment B',
      typeSeance: 'Cours',
    },
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
    extendedProps: {
      description: 'Travail sur les exercices pratiques du chapitre 3.',
      module: 'Bases de données',
      groupe: 'Groupe C',
      enseignant: 'M. Leroy',
      salle: 'B102',
      batiment: 'Bâtiment C',
      typeSeance: 'Travaux dirigés',
    },
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
  const [selectedSeance, setSelectedSeance] = useState<DetailsSeance | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate)
    }
  }, [selectedDate])

  function closeModal() {
    setIsModalOpen(false)
    setSelectedSeance(null)
  }

  function handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event
    if (!event.start || !event.end) return

    setSelectedSeance(
      detailsSeanceFromPlanningLike({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps: event.extendedProps as { [key: string]: unknown },
      })
    )
    setIsModalOpen(true)
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
          eventClick={handleEventClick}
          editable={false}
          selectable={false}
        />
      </div>
      <SeanceDetailsModal isOpen={isModalOpen} onClose={closeModal} seance={selectedSeance} />
    </div>
  )
}

export default PlanningCalendar