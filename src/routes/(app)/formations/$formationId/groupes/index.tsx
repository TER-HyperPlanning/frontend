import { createFileRoute } from '@tanstack/react-router'
import { GroupesPage } from '@/features/groupes/pages/GroupesPage'

export const Route = createFileRoute('/(app)/formations/$formationId/groupes/')({
  validateSearch: (search: Record<string, unknown>) => ({
    groupId: typeof search.groupId === 'string' ? search.groupId : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { formationId } = Route.useParams()
  const { groupId } = Route.useSearch()

  return (
    <GroupesPage
      formationId={formationId}
      selectedGroupId={groupId}
      onSelectGroup={(selectedGroupId) => {
        void navigate({
          to: '/formations/$formationId/groupes',
          params: { formationId },
          search: { groupId: selectedGroupId },
        })
      }}
      onShowAllGroups={() => {
        void navigate({
          to: '/groupes',
          search: { groupId: undefined },
        })
      }}
      onBackToFormation={() => {
        void navigate({ to: '/formations' })
      }}
    />
  )
}
