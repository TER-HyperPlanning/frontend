import MainMenuContainer from '@/layout/main-menu-layout/MainMenuContainer'
import MainNavigator from '@/layout/main-menu-layout/MainNavigator'
import MainPageContainer from '@/layout/main-menu-layout/MainPageContainer'
import { getAccessToken } from '@/auth/storage'
import { useCurrentUser } from '@/hooks/api/useAuth'
import { createFileRoute, Outlet, redirect, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/(app)')({
  beforeLoad: () => {
    if (!getAccessToken()) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const { data: user, isLoading } = useCurrentUser()

  useEffect(() => {
    if (!user) return
    if (user.role === 'STUDENT' && !routerState.location.pathname.startsWith('/planning')) {
      navigate({ to: '/planning', replace: true })
    }
  }, [navigate, routerState.location.pathname, user])

  if (isLoading) {
    return <div className="w-full h-full bg-gray-100" />
  }

  if (user?.role === 'STUDENT') {
    return <Outlet />
  }

  return (
    <MainMenuContainer>
      <MainNavigator />
      <MainPageContainer>
        <Outlet />
      </MainPageContainer>
    </MainMenuContainer>
  )
}
