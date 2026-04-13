import FilieresPage from '@/components/filieres/FilieresPage'
import PageLayout from '@/layout/PageLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/filieres/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout className="p-6 overflow-y-auto">
      <FilieresPage />
    </PageLayout>
  )
}
