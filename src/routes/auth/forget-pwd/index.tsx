import { createFileRoute } from '@tanstack/react-router'
import ForgotPasswordForm from '@/components/forms/auth/ForgotPasswordForm'

export const Route = createFileRoute('/auth/forget-pwd/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForgotPasswordForm />
}
