import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/forms/auth/LoginForm'
import GlassLayout from '@/layout/GlassLayout'

export const Route = createFileRoute('/auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GlassLayout className='w-full sm:w-96 rounded-md bg-primary-100/20'>
  <LoginForm />
  </GlassLayout>
}
