import React from 'react'

interface Props{
    children:React.ReactNode
}

function MainMenuContainer({children}:Props) {
  return (
    <div className="size-full flex flex-col-reverse md:flex-row bg-gray-100">{children}</div>

  )
}

export default MainMenuContainer