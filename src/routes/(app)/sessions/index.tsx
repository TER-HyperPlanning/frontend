import SessionsPage from '@/components/sessions/SessionsPage'
import PageLayout from '@/layout/PageLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/sessions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout className="p-6 overflow-y-auto">
      <SessionsPage />
    </PageLayout>
  )
}
