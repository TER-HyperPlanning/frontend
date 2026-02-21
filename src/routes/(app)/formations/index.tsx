import FormationsPage from '@/components/formations/FormationsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/formations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormationsPage />
}
