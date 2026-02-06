import Logo from '@/components/Logo'
import PageLayout from '@/layout/PageLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
   return <PageLayout className='bg-[url("/signin-bg.webp")] bg-cover bg-center bg-no-repeat flex justify-center items-center'>
    <div className='flex flex-col items-center gap-6'>
        <Logo showText className='text-white h-20'/>
        <div className='w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <Outlet/>
        </div>
    </div>
  </PageLayout>
}
