import PlanningCalendar from '@/components/planning/PlanningCalendar'
import DateStrip from '@/components/planning/DateStrip'
import PlanningHeader from '@/components/planning/PlanningHeader'
import { useCurrentUser } from '@/hooks/api/useAuth'
import { usePlanning, useMyPlanning } from '@/hooks/planning/usePlanning'
import { getAccessToken } from '@/auth/storage'
import type { PlanningFilters } from '@/types/planning'
import MainMenuContainer from '@/layout/main-menu-layout/MainMenuContainer'
import MainNavigator from '@/layout/main-menu-layout/MainNavigator'
import MainPageContainer from '@/layout/main-menu-layout/MainPageContainer'
import PageLayout from '@/layout/PageLayout'
import { getInitialDate } from '@/utils/date.utils'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'

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
      />
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

