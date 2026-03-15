import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/groupes/mockData')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/groupes/mockData"!</div>
}
