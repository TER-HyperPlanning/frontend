
interface Props {
    children: React.ReactNode
}

function MainLayout({ children }: Props) {
  return (
    <div className="w-screen h-screen">{children}</div>
  )
}

export default MainLayout