import LoginForm from '@/components/forms/auth/LoginForm'
import  Logo from '@/components/Logo'
import GlassLayout from '@/layout/GlassLayout'
import PageLayout from '@/layout/PageLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PageLayout className='bg-[url("/signin-bg.webp")] bg-cover bg-center bg-no-repeat flex justify-center items-center'>
    <div className='flex flex-col items-center gap-6'>
        <Logo showText className='text-white h-20'/>
        <GlassLayout className='w-96 rounded-md bg-primary-100/20'>
            <LoginForm/>
        </GlassLayout>
    </div>
  </PageLayout>
}
