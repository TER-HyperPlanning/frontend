
interface Props{
    children: React.ReactNode
}

function PageHeader({children}: Props) {
  return (
    <div className="flex w-full p-3 gap-1 items-center">{children}</div>
  )
}

export default PageHeader