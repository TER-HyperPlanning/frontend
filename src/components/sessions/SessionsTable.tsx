import { type SessionWithGroup, SESSION_MODE_LABELS } from '@/types/session'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/Table'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

interface SessionsTableProps {
  sessions: SessionWithGroup[]
  isLoading: boolean
  onEdit: (session: SessionWithGroup) => void
  onDelete: (session: SessionWithGroup) => void
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }) + ' ' + d.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  })
}

export default function SessionsTable({
  sessions,
  isLoading,
  onEdit,
  onDelete,
}: SessionsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 gap-3">
        <span className="loading loading-spinner loading-md text-primary" />
        <span className="text-base-content/60 text-sm">
          Chargement des séances...
        </span>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-base-content/50 text-sm">
          Aucune séance enregistrée
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow className="text-base-content/60 text-xs uppercase">
          <TableHeader>Type</TableHeader>
          <TableHeader>Groupe</TableHeader>
          <TableHeader>Module</TableHeader>
          <TableHeader>Début</TableHeader>
          <TableHeader>Fin</TableHeader>
          <TableHeader>Mode</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-medium text-base-content">
              {session.type}
            </TableCell>
            <TableCell className="text-sm text-base-content/80">
              {session.groupName || '—'}
            </TableCell>
            <TableCell className="font-medium text-base-content">
              {session.course || '—'}
            </TableCell>
            <TableCell className="text-sm text-base-content/80 whitespace-nowrap">
              {formatDateTime(session.startDateTime)}
            </TableCell>
            <TableCell className="text-sm text-base-content/80 whitespace-nowrap">
              {formatDateTime(session.endDateTime)}
            </TableCell>
            <TableCell className="text-sm text-base-content/80 whitespace-nowrap">
              {SESSION_MODE_LABELS[session.mode]}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(session)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary"
                >
                  <PencilSquareIcon className="size-4" />
                </button>
                <button
                  onClick={() => onDelete(session)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-error"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
