import { createFileRoute } from '@tanstack/react-router'
import { GroupesPage } from '@/features/groupes/pages/GroupesPage'

export const Route = createFileRoute('/(app)/groupes/')({
  component: () => <GroupesPage />,
})
