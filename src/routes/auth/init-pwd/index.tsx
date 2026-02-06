import InitPasswordForm from '@/components/forms/auth/InitPasswordForm'
import GlassLayout from '@/layout/GlassLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/init-pwd/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GlassLayout className='w-96 rounded-md bg-primary-100/20'>
            <InitPasswordForm/>
        </GlassLayout>
}
