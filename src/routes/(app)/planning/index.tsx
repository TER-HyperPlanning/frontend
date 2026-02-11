import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/planning/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/planning/"!</div>
}
