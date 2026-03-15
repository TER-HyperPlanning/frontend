import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/groupes/components/GroupFilters')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/groupes/components/GroupFilters"!</div>
}
