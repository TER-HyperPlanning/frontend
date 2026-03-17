import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/forms/auth/LoginForm'

export const Route = createFileRoute('/auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
