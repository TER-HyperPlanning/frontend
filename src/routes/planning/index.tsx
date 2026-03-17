import PlanningCalendar from '@/components/planning/PlanningCalendar'
import DateStrip from '@/components/planning/DateStrip'
import PlanningHeader from '@/components/planning/PlanningHeader'
import { useCurrentUser } from '@/hooks/api/useAuth'
import MainMenuContainer from '@/layout/main-menu-layout/MainMenuContainer'
import MainNavigator from '@/layout/main-menu-layout/MainNavigator'
import MainPageContainer from '@/layout/main-menu-layout/MainPageContainer'
import PageLayout from '@/layout/PageLayout'
import { getInitialDate } from '@/utils/date.utils'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/planning/')({
  component: RouteComponent,
})

function PlanningContent() {
  const [selectedDate, setSelectedDate] = useState(getInitialDate)

  return (
    <PageLayout className="flex flex-col">
      <PlanningHeader />
      <DateStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <PlanningCalendar selectedDate={selectedDate} />
    </PageLayout>
  )
}

function RouteComponent() {
  const { data: user } = useCurrentUser()

  // Invite + students: full page (no left navigator)
  if (!user || user.role === 'STUDENT') {
    return <PlanningContent />
  }

  // Authenticated non-students: keep the full app layout
  return (
    <MainMenuContainer>
      <MainNavigator />
      <MainPageContainer>
        <PlanningContent />
      </MainPageContainer>
    </MainMenuContainer>
  )
}

