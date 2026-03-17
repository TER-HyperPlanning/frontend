import { createFileRoute } from '@tanstack/react-router'
import InitPasswordForm from '@/components/forms/auth/InitPasswordForm'
import GlassLayout from '@/layout/GlassLayout'

export const Route = createFileRoute('/auth/init-pwd/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GlassLayout className='w-full sm:w-96 rounded-md bg-primary-100/20'>
  <InitPasswordForm />
  </GlassLayout>
}
