import React from 'react'

interface Props{
    children:React.ReactNode
}

function MainMenuContainer({children}:Props) {
  return (
    <div className="h-screen w-full flex flex-col-reverse md:flex-row bg-gray-100 overflow-hidden">
      {children}
    </div>
  )
}

export default MainMenuContainer