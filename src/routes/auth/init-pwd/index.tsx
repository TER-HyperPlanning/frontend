import { createFileRoute } from '@tanstack/react-router'
import InitPasswordForm from '@/components/forms/auth/InitPasswordForm'

export const Route = createFileRoute('/auth/init-pwd/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InitPasswordForm />
}
