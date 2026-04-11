import { createFileRoute } from '@tanstack/react-router'
import { GroupesPage } from '@/features/groupes/pages/GroupesPage'

export const Route = createFileRoute('/(app)/groupes/')({
  validateSearch: (search: Record<string, unknown>) => ({
    groupId: typeof search.groupId === 'string' ? search.groupId : undefined,
    fromFormationId: typeof search.fromFormationId === 'string' ? search.fromFormationId : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { groupId, fromFormationId } = Route.useSearch()

  return (
    <GroupesPage
      selectedGroupId={groupId}
      onSelectGroup={(selectedGroupId) => {
        void navigate({
          to: '/groupes',
          search: {
            groupId: selectedGroupId,
            fromFormationId,
          },
        })
      }}
      onShowAllGroups={() => {
        void navigate({
          to: '/groupes',
          search: {
            groupId: undefined,
            fromFormationId,
          },
        })
      }}
      onBackToFormation={() => {
        if (fromFormationId) {
          void navigate({
            to: '/formations/$formationId/groupes',
            params: { formationId: fromFormationId },
          })
          return
        }

        void navigate({ to: '/formations' })
      }}
    />
  )
}
