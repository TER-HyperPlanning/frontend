import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/planning/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='size-full flex justify-center items-center text-secondary-600 text-3xl'>Hello "/(app)/planning/"!</div>
}
