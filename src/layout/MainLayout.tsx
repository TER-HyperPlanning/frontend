import React from 'react'
import NotificationBell from '@/features/notifications/components/NotificationBell'
import { useCurrentUser } from '@/hooks/api/useAuth'

interface Props {
    children: React.ReactNode
}

function MainLayout({ children }: Props) {
  const { data: user } = useCurrentUser()

  return (
    <div className="w-screen h-screen bg-white text-black relative">
        {children}
        {!!user && <NotificationBell />}
    </div>
  )
}

export default MainLayout