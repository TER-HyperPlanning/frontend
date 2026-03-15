import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(app)/groupes/components/EmptyGroupState',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/groupes/components/EmptyGroupState"!</div>
}
