import MainMenuContainer from '@/layout/main-menu-layout/MainMenuContainer'
import MainNavigator from '@/layout/main-menu-layout/MainNavigator'
import MainPageContainer from '@/layout/main-menu-layout/MainPageContainer'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainMenuContainer>
        <MainNavigator>
            Hello
        </MainNavigator>
      <MainPageContainer>
        <Outlet />
      </MainPageContainer>
    </MainMenuContainer>
  )
}
