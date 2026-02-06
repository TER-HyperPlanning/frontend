import ForgotPasswordForm from '@/components/forms/auth/ForgotPasswordForm'
import GlassLayout from '@/layout/GlassLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/forget-pwd/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GlassLayout className='w-96 rounded-md bg-primary-100/20'>
            <ForgotPasswordForm/>
        </GlassLayout>
}
