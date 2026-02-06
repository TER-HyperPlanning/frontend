import Logo from '@/components/Logo'
import PageLayout from '@/layout/PageLayout'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouterState()
  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey(prev => prev + 1)
  }, [router.location.pathname])

   return <PageLayout className='bg-[url("/signin-bg.webp")] bg-cover bg-center bg-no-repeat flex justify-center items-center'>
    <div className='flex flex-col items-center gap-6'>
        <Logo showText className='text-white h-20'/>
        <div 
          key={key}
          className='w-full flex justify-center animate-[fadeSlideIn_0.5s_ease-out]'
          style={{
            animation: 'fadeSlideIn 0.5s ease-out'
          }}
        >
          <Outlet/>
        </div>
    </div>
    <style>{`
      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </PageLayout>
}
