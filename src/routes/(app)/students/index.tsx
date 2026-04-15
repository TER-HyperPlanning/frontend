import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '@/layout/PageLayout'
import { StudentCrud } from '@/components/Students'

export const Route = createFileRoute('/(app)/students/')({
  component: StudentsPage,
})

function StudentsPage() {
  return (
    <PageLayout className="p-6 overflow-y-auto">
      <StudentCrud />
    </PageLayout>
  )
}
