import FormationsPage from '@/components/formations/FormationsPage'
import PageLayout from '@/layout/PageLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/formations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout className="p-6 overflow-y-auto">
      <FormationsPage />
    </PageLayout>
  )
}
