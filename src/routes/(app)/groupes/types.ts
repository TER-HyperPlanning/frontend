import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/groupes/types')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/groupes/types"!</div>
}
