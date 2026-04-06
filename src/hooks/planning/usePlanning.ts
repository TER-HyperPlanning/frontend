import { useQuery } from '@tanstack/react-query'
import { useAppClient } from '@/hooks/api/useAppClient'
import { apiGet } from '@/services/apiClient'
import { getAccessToken } from '@/auth/storage'
import type { EventInput } from '@fullcalendar/core'
import type {
  PlanningWeekDto,
  PlanningFilters,
  PlanningSessionDto,
} from '@/types/planning'

type ApiResponse<T> = {
  status: string | null
  message: string | null
  result: T
}

const SESSION_TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  CM: { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a5f' },
  TD: { bg: '#dcfce7', border: '#22c55e', text: '#14532d' },
  TP: { bg: '#fef9c3', border: '#eab308', text: '#713f12' },
}

const DEFAULT_COLORS = { bg: '#f3f4f6', border: '#d1d5db', text: '#1f2937' }

function buildQueryParams(filters: PlanningFilters): string {
  const params = new URLSearchParams()
  if (filters.groupId) params.set('GroupId', filters.groupId)
  if (filters.trackId) params.set('TrackId', filters.trackId)
  if (filters.programId) params.set('ProgramId', filters.programId)
  if (filters.startDate) params.set('StartDate', filters.startDate)
  if (filters.endDate) params.set('EndDate', filters.endDate)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function toCalendarEvents(weeks: PlanningWeekDto[]): EventInput[] {
  const events: EventInput[] = []

  for (const week of weeks) {
    if (!week.weekdays) continue
    for (const day of week.weekdays) {
      if (!day.sessions) continue
      for (const session of day.sessions) {
        const colors = SESSION_TYPE_COLORS[session.type ?? ''] ?? DEFAULT_COLORS
        events.push(sessionToEvent(session, colors))
      }
    }
  }

  return events
}

function sessionToEvent(
  s: PlanningSessionDto,
  colors: { bg: string; border: string; text: string },
): EventInput {
  const titleParts = [s.type, s.course].filter(Boolean)
  return {
    id: s.id ?? undefined,
    title: titleParts.join(' - ') || 'Session',
    start: s.startDateTime,
    end: s.endDateTime,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    textColor: colors.text,
    extendedProps: {
      mode: s.mode,
      type: s.type,
      status: s.status,
      room: s.room,
      course: s.course,
      description: s.description,
    },
  }
}

/**
 * Fetch the general planning (public-ish — works without auth via apiGet).
 * Used for the public planning view or when filtering by group/track/program.
 */
export function usePlanning(filters: PlanningFilters) {
  const hasToken = !!getAccessToken()
  const appClient = hasToken ? useAppClient() : null

  return useQuery({
    queryKey: ['planning', filters],
    queryFn: async () => {
      const qs = buildQueryParams(filters)

      if (appClient) {
        const { data } = await appClient.api.get<ApiResponse<PlanningWeekDto[]>>(
          `/Planning${qs}`,
        )
        return toCalendarEvents(data.result ?? [])
      }

      const result = await apiGet<PlanningWeekDto[]>(`/Planning${qs}`)
      return toCalendarEvents(result ?? [])
    },
  })
}

/**
 * Fetch the current user's personal planning (requires auth).
 */
export function useMyPlanning(filters: PlanningFilters) {
  const { api } = useAppClient()
  const hasToken = !!getAccessToken()

  return useQuery({
    queryKey: ['planning', 'me', filters],
    enabled: hasToken,
    queryFn: async () => {
      const qs = buildQueryParams(filters)
      const { data } = await api.get<ApiResponse<PlanningWeekDto[]>>(
        `/Planning/me${qs}`,
      )
      return toCalendarEvents(data.result ?? [])
    },
  })
}
