

interface Props {
    children: React.ReactNode
}

function MainNavigator({ children }: Props) {
  return (
    <div>{children}</div>
  )
}

export default MainNavigator