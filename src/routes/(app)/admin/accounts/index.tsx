import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '@/layout/PageLayout'
import AccountsList from '@/components/admin/AccountsList'

export const Route = createFileRoute('/(app)/admin/accounts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout>
      <div className="size-full overflow-auto">
        <div className="min-h-full p-4 sm:p-6 lg:p-8">
          <AccountsList />
        </div>
      </div>
    </PageLayout>
  )
}
