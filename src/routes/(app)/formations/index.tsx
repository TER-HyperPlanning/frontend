import FormationsPage from '@/components/formations/FormationsPage'
import PageLayout from '@/layout/PageLayout'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const formationsSearchSchema = z.object({
  filiereId: z.string().optional(),
  editId: z.string().optional(),
})

export const Route = createFileRoute('/(app)/formations/')({
  validateSearch: formationsSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { filiereId, editId } = Route.useSearch()

  return (
    <PageLayout className="p-6 overflow-y-auto">
      <FormationsPage defaultFiliereId={filiereId} autoEditId={editId} />
    </PageLayout>
  )
}
