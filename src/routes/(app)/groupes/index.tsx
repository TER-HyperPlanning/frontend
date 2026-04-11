import { createFileRoute } from '@tanstack/react-router'
import { GroupesPage } from '@/features/groupes/pages/GroupesPage'

export const Route = createFileRoute('/(app)/groupes/')({
  validateSearch: (search: Record<string, unknown>) => ({
    groupId: typeof search.groupId === 'string' ? search.groupId : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { groupId } = Route.useSearch()

  return (
    <GroupesPage
      selectedGroupId={groupId}
      onSelectGroup={(selectedGroupId) => {
        void navigate({
          to: '/groupes',
          search: { groupId: selectedGroupId },
        })
      }}
      onShowAllGroups={() => {
        void navigate({ to: '/groupes' })
      }}
      onBackToFormation={() => {
        void navigate({ to: '/formations' })
      }}
    />
  )
}
