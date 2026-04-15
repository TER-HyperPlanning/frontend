interface Props {
    children: React.ReactNode
}

function MainPageContainer({ children }: Props) {
    return (
        <div className="flex flex-col flex-1 h-screen overflow-y-auto bg-white rounded-t-2xl md:rounded-t-none md:rounded-l-2xl">
            {children}
        </div>
    )
}

export default MainPageContainer