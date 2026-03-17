import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '@/layout/PageLayout'

export const Route = createFileRoute('/(app)/planning/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout className="p-6 overflow-y-auto">
      <div className="card bg-base-100 border border-base-200">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-base-content">Planning</h1>
          <p className="text-base-content/60">La vue planning est prête pour l'intégration fonctionnelle.</p>
        </div>
      </div>
    </PageLayout>
  )
}
