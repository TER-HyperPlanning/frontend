import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/groupes/components/AssignModal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/groupes/components/AssignModal"!</div>
}
