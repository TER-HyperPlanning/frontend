import MainMenuContainer from '@/layout/main-menu-layout/MainMenuContainer'
import MainNavigator from '@/layout/main-menu-layout/MainNavigator'
import MainPageContainer from '@/layout/main-menu-layout/MainPageContainer'
import { getAccessToken } from '@/auth/storage'
import {
  getCurrentUserForGuard,
  getHomePathForRole,
  isAllowedAppPath,
  normalizeRole,
} from '@/auth/rolePermissions'
import { useCurrentUser } from '@/hooks/api/useAuth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
  beforeLoad: async ({ location }) => {
    if (!getAccessToken()) {
      throw redirect({ to: '/auth/login' })
    }

    const user = await getCurrentUserForGuard()
    const role = normalizeRole(user?.role)
    if (!role) {
      throw redirect({ to: '/auth/login' })
    }

    if (role === 'STUDENT') {
      throw redirect({ to: '/planning' })
    }

    if (!isAllowedAppPath(role, location.pathname)) {
      throw redirect({ to: getHomePathForRole(role) })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { isLoading } = useCurrentUser()

  if (isLoading) {
    return <div className="w-full h-full bg-gray-100" />
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
