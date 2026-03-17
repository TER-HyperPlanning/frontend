import { useState } from 'react'
import PlanningHeader from '@/components/planning/PlanningHeader'
import DateStrip from '@/components/planning/DateStrip'
import PlanningCalendar from '@/components/planning/PlanningCalendar'
import PageLayout from '@/layout/PageLayout'
import { getInitialDate } from '@/utils/date.utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/planning/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState(getInitialDate)

  return (
    <PageLayout className="flex flex-col">
      <PlanningHeader />
      <DateStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <PlanningCalendar selectedDate={selectedDate} />
    </PageLayout>
  )
}
