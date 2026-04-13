import React from 'react'
import NotificationBell from '@/features/notifications/components/NotificationBell'

interface Props{
    children:React.ReactNode
}

function MainMenuContainer({children}:Props) {
  return (
    <div className="h-screen w-full flex flex-col-reverse md:flex-row bg-gray-100 overflow-hidden relative">
      {children}
      <NotificationBell />
    </div>
  )
}

export default MainMenuContainer