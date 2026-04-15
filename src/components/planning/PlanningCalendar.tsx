import { useRef, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import type {
  EventInput,
  EventContentArg,
  DayHeaderContentArg,
  EventHoveringArg,
  EventDropArg,
  EventClickArg,
} from '@fullcalendar/core'
import {
  CalendarClock,
  Clock3,
  DoorOpen,
  Monitor,
  Shapes,
  Tag,
  Text,
} from 'lucide-react'
import DragDropConfirmModal from './DragDropConfirmModal'
import SessionDetailsModal from './SessionDetailsModal'
import AddSessionModal from '@/components/sessions/AddSessionModal'
import EditSessionModal from '@/components/sessions/EditSessionModal'
import DeleteSessionModal from '@/components/sessions/DeleteSessionModal'
import { type SessionWithGroup } from '@/types/session'
import './planning-calendar.css'

interface PlanningCalendarProps {
  selectedDate: Date
  events?: EventInput[]
  isLoading?: boolean
  onEventDrop?: (arg: EventDropArg) => void
  onEventClick?: (arg: EventClickArg) => void
  onDoubleClick?: (startDate: Date, endDate: Date) => void // Double-click with time range
  onEventDropForConfirmation?: (eventId: string, oldStart: Date, oldEnd: Date, newStart: Date, newEnd: Date) => Promise<void | boolean> // Drag with confirmation (async validation)
  // Modal states
  dragDropConfirmOpen?: boolean
  dragDropData?: {
    originalStart: Date
    originalEnd: Date
    newStart: Date
    newEnd: Date
  } | null
  dragDropLoading?: boolean
  dragDropError?: string | null
  onConfirmDragDrop?: () => void
  onCancelDragDrop?: () => void
  sessionDetailsOpen?: boolean
  selectedSession?: SessionWithGroup | null
  onCloseSessionDetails?: () => void
  onEditSession?: (session: SessionWithGroup) => void
  onDeleteSessionFromDetails?: (session: SessionWithGroup) => void
  addSessionOpen?: boolean
  addSessionDefaultDate?: Date | null
  addSessionDateRange?: { start: Date; end: Date } | null
  onCloseAddSession?: () => void
  onAddSession?: (values: any) => Promise<boolean>
  editSessionOpen?: boolean
  editTarget?: SessionWithGroup | null
  onCloseEditSession?: () => void
  onEditSession2?: (values: any) => Promise<boolean>
  deleteConfirmOpen?: boolean
  deleteTarget?: SessionWithGroup | null
  onCloseDeleteConfirm?: () => void
  onConfirmDelete?: () => void
}

interface PlanningTooltipData {
  x: number
  y: number
  start: Date | null
  end: Date | null
  mode: string | null
  type: string | null
  status: string | null
  room: string | null
  course: string | null
  description: string | null
}

function renderEventContent(eventInfo: EventContentArg) {
  const { room, course, description } = eventInfo.event.extendedProps ?? {}
  const subtitle = [course, room].filter(Boolean).join(' · ')
  return (
    <div className="p-1.5 h-full">
      <p className="font-semibold text-sm leading-tight">
        {eventInfo.event.title}
      </p>
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

function formatDate(value: Date | null): string {
  if (!value) return ''
  return value.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(value: Date | null): string {
  if (!value) return ''
  return value.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStringOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function hasValue(value: string | null | undefined): value is string {
  return Boolean(value && value.trim().length > 0)
}

function PlanningCalendar({
  selectedDate,
  events = [],
  isLoading,
  onEventDrop,
  onEventClick,
  dragDropConfirmOpen = false,
  dragDropData = null,
  dragDropLoading = false,
  dragDropError = null,
  onConfirmDragDrop,
  onCancelDragDrop,
  sessionDetailsOpen = false,
  selectedSession = null,
  onCloseSessionDetails,
  onEditSession,
  onDeleteSessionFromDetails,
  addSessionOpen = false,
  addSessionDefaultDate = null,
  addSessionDateRange = null,
  onCloseAddSession,
  onAddSession,
  editSessionOpen = false,
  editTarget = null,
  onCloseEditSession,
  onEditSession2,
  deleteConfirmOpen = false,
  deleteTarget = null,
  onCloseDeleteConfirm,
  onConfirmDelete,
  onDoubleClick,
  onEventDropForConfirmation,
}: PlanningCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<PlanningTooltipData | null>(null)

  let clickTimer: any = null

  const handleDateClick = (arg: any) => {
    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null

      // 👉 DOUBLE CLICK detected
      handleDoubleClick(arg)
    } else {
      clickTimer = setTimeout(() => {
        clickTimer = null
      }, 250)
    }
  }

  const handleDoubleClick = (arg: any) => {
    const start = new Date(arg.date)
    // Snap to 15min if needed - round down to nearest 15min
    const minutes = start.getMinutes() 
    const remainder = minutes % 15
    if (remainder !== 0) {
      start.setMinutes(minutes + remainder)
      start.setSeconds(0)
    }
    
    // Default duration: 1h30 (90 minutes)
    const end = new Date(start.getTime() + 90 * 60 * 1000)
    
    onDoubleClick?.(start, end)
  }

  const handleEventDropWithConfirmation = async (arg: EventDropArg) => {
    const eventId = arg.event.id
    const oldStart = arg.oldEvent.start
    const oldEnd = arg.oldEvent.end
    const newStart = arg.event.start
    const newEnd = arg.event.end

    if (!eventId || !oldStart || !oldEnd || !newStart || !newEnd) {
      arg.revert()
      return
    }

    // Revert event visually while we validate and wait for confirmation
    arg.revert()

    // If confirmation callback provided, use confirmation flow
    if (onEventDropForConfirmation) {
      await onEventDropForConfirmation(eventId, oldStart, oldEnd, newStart, newEnd)
    } else {
      // Otherwise, fall back to direct update (for backward compatibility)
      onEventDrop?.(arg)
    }
  }

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate)
    }
  }, [selectedDate])

  function toTooltipData(arg: EventHoveringArg): PlanningTooltipData {
    const props = arg.event.extendedProps as Record<string, unknown>
    return {
      x: arg.jsEvent.clientX,
      y: arg.jsEvent.clientY,
      start: arg.event.start,
      end: arg.event.end,
      mode: getStringOrNull(props.mode),
      type: getStringOrNull(props.type),
      status: getStringOrNull(props.status),
      room: getStringOrNull(props.room),
      course: getStringOrNull(props.course),
      description: getStringOrNull(props.description),
    }
  }

  function handleMouseEnter(arg: EventHoveringArg) {
    setTooltip(toTooltipData(arg))
  }

  function handleMouseLeave() {
    setTooltip(null)
  }

  const tooltipStyle =
    tooltip && containerRef.current
      ? {
          left:
            tooltip.x - containerRef.current.getBoundingClientRect().left + 12,
          top:
            tooltip.y - containerRef.current.getBoundingClientRect().top + 12,
        }
      : undefined

  return (
    <div
      ref={containerRef}
      className="planning-calendar flex-1 overflow-auto px-1 relative"
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}
      <div className="min-w-[700px] h-full">
        <FullCalendar
          selectable={true}
          dateClick={handleDateClick}
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          locale={frLocale}
          initialView="timeGridWeek"
          initialDate={selectedDate}
          headerToolbar={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotDuration="01:00:00"
          snapDuration="00:15:00"
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
          eventMouseEnter={handleMouseEnter}
          eventMouseLeave={handleMouseLeave}
          editable={true}
          eventDurationEditable={false}
          eventDrop={handleEventDropWithConfirmation}
          eventClick={onEventClick}
        />
      </div>
      {tooltip && tooltipStyle && (
        <div className="planning-tooltip" style={tooltipStyle}>
          <p className="planning-tooltip-title">Details de la seance</p>
          {hasValue(formatDate(tooltip.start)) && (
            <div className="planning-tooltip-row">
              <CalendarClock
                size={14}
                className="planning-tooltip-icon text-indigo-300"
              />
              <span className="planning-tooltip-tag planning-tooltip-tag--indigo">
                Date
              </span>
              <span className="planning-tooltip-value">
                {formatDate(tooltip.start)}
              </span>
            </div>
          )}
          {hasValue(formatTime(tooltip.start)) &&
            hasValue(formatTime(tooltip.end)) && (
              <div className="planning-tooltip-row">
                <Clock3
                  size={14}
                  className="planning-tooltip-icon text-violet-300"
                />
                <span className="planning-tooltip-tag planning-tooltip-tag--violet">
                  Horaire
                </span>
                <span className="planning-tooltip-value">
                  {formatTime(tooltip.start)} - {formatTime(tooltip.end)}
                </span>
              </div>
            )}
          {hasValue(tooltip.mode) && (
            <div className="planning-tooltip-row">
              <Monitor
                size={14}
                className="planning-tooltip-icon text-blue-300"
              />
              <span className="planning-tooltip-tag planning-tooltip-tag--blue">
                Mode
              </span>
              <span className="planning-tooltip-value">{tooltip.mode}</span>
            </div>
          )}
          {hasValue(tooltip.type) && (
            <div className="planning-tooltip-row">
              <Shapes
                size={14}
                className="planning-tooltip-icon text-emerald-300"
              />
              <span className="planning-tooltip-tag planning-tooltip-tag--emerald">
                Type
              </span>
              <span className="planning-tooltip-value">{tooltip.type}</span>
            </div>
          )}
          {hasValue(tooltip.status) && (
            <div className="planning-tooltip-row">
              <Tag size={14} className="planning-tooltip-icon text-amber-300" />
              <span className="planning-tooltip-tag planning-tooltip-tag--amber">
                Status
              </span>
              <span className="planning-tooltip-value">{tooltip.status}</span>
            </div>
          )}
          {hasValue(tooltip.room) && (
            <div className="planning-tooltip-row">
              <DoorOpen
                size={14}
                className="planning-tooltip-icon text-rose-300"
              />
              <span className="planning-tooltip-tag planning-tooltip-tag--rose">
                Salle
              </span>
              <span className="planning-tooltip-value">{tooltip.room}</span>
            </div>
          )}
          {hasValue(tooltip.course) && (
            <div className="planning-tooltip-row">
              <Text size={14} className="planning-tooltip-icon text-teal-300" />
              <span className="planning-tooltip-tag planning-tooltip-tag--teal">
                Cours
              </span>
              <span className="planning-tooltip-value">{tooltip.course}</span>
            </div>
          )}
          {hasValue(tooltip.description) && (
            <div className="planning-tooltip-row">
              <Text
                size={14}
                className="planning-tooltip-icon text-fuchsia-300"
              />
              <span className="planning-tooltip-tag planning-tooltip-tag--fuchsia">
                Description
              </span>
              <span className="planning-tooltip-value">
                {tooltip.description}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <DragDropConfirmModal
        isOpen={dragDropConfirmOpen}
        data={dragDropData}
        isLoading={dragDropLoading}
        error={dragDropError ?? null}
        onConfirm={onConfirmDragDrop ?? (() => {})}
        onCancel={onCancelDragDrop ?? (() => {})}
      />

      <SessionDetailsModal
        isOpen={sessionDetailsOpen}
        session={selectedSession ?? null}
        onClose={onCloseSessionDetails ?? (() => {})}
        onEdit={onEditSession ?? (() => {})}
        onDelete={onDeleteSessionFromDetails ?? (() => {})}
      />

      <AddSessionModal
        isOpen={addSessionOpen}
        onClose={onCloseAddSession ?? (() => {})}
        defaultGroupId=""
        defaultDate={addSessionDefaultDate}
        defaultDateRange={addSessionDateRange}
        onAdd={onAddSession ?? (async () => false)}
      />

      <EditSessionModal
        isOpen={editSessionOpen}
        session={editTarget ?? null}
        onClose={onCloseEditSession ?? (() => {})}
        onEdit={onEditSession2 ?? (async () => false)}
      />

      <DeleteSessionModal
        isOpen={deleteConfirmOpen}
        session={deleteTarget ?? null}
        onClose={onCloseDeleteConfirm ?? (() => {})}
        onConfirm={onConfirmDelete ?? (() => {})}
      />
    </div>
  )
}

export default PlanningCalendar
