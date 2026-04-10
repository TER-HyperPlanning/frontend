import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIsAdmin } from '@/hooks/useUserRole'
import MainLayout from '@/layout/MainLayout'
import PageLayout from '@/layout/PageLayout'
import { TeacherRequestsCard } from '@/components/requests/TeacherRequestsCard'
import MainMenuContainer from '@/layout/main-menu-layout/MainMenuContainer'
import MainNavigator from '@/layout/main-menu-layout/MainNavigator'
import MainPageContainer from '@/layout/main-menu-layout/MainPageContainer'

export const Route = createFileRoute('/teacher-requests')({
  component: RouteComponent,
})

function TeacherRequestsContent() {
  return (
    <PageLayout title="Demandes des Enseignants">
      <div className="space-y-6">
        <TeacherRequestsCard />
      </div>
    </PageLayout>
  )
}

function RouteComponent() {
  const isAdmin = useIsAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    // Only admin can view teacher requests
    if (!isAdmin) {
      navigate({ to: '/planning' })
    }
  }, [isAdmin, navigate])

  if (!isAdmin) {
    return null
  }

  // Admin: show full app layout
  return (
    <MainMenuContainer>
      <MainNavigator />
      <MainPageContainer>
        <TeacherRequestsContent />
      </MainPageContainer>
    </MainMenuContainer>
  )
}

