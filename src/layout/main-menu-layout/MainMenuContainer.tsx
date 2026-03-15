
interface Props{
    children:React.ReactNode
}

function MainMenuContainer({children}:Props) {
  return (
    <div className="size-full flex bg-gray-100">{children}</div>

  )
}

export default MainMenuContainer