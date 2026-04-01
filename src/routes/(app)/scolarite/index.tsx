import { createFileRoute } from '@tanstack/react-router'
import ScolaritePage from '@/components/scolarite/ScolaritePage'

export const Route = createFileRoute('/(app)/scolarite/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <ScolaritePage />
}
