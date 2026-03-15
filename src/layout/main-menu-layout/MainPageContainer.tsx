interface Props {
    children: React.ReactNode
}

function MainPageContainer({ children }: Props) {
    return (
        <div className="flex flex-col flex-1 bg-white rounded-l-2xl">{children}</div>
    )
}

export default MainPageContainer