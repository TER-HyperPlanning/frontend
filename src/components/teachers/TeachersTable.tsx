import { Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'

import type { Teacher } from './types'

interface Props {
  teachers: Teacher[]
  onEditClick: (teacher: Teacher) => void
  onDeleteClick: (teacher: Teacher) => void
}

export default function TeachersTable({
  teachers,
  onEditClick,
  onDeleteClick,
}: Props) {
  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'Permanent':
        return BADGE_STYLES['active-outline']
      case 'Vacataire':
        return BADGE_STYLES['warning-outline']
      default:
        return BADGE_STYLES['secondary-outline']
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nom</TableHeader>
          <TableHeader>Prénom</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Statut</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {teachers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="px-4 py-0">
              <EmptyState
                title="Aucun enseignant"
                message="Aucun enseignant enregistré pour le moment"
              />
            </TableCell>
          </TableRow>
        ) : (
          teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              
              <TableCell className="font-semibold text-base-content">
                {teacher.nom}
              </TableCell>

              <TableCell className="text-sm text-base-content/80">
                {teacher.prenom}
              </TableCell>

              <TableCell className="text-sm text-primary/80 hover:text-primary">
                {teacher.email}
              </TableCell>

              <TableCell>
                <span className={getStatusBadge(teacher.statut)}>
                  {teacher.statut}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  
                  {/* Edit */}
                  <button
                    className={ACTION_BUTTON_STYLES.edit}
                    onClick={() => onEditClick(teacher)}
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    className={ACTION_BUTTON_STYLES.delete}
                    onClick={() => onDeleteClick(teacher)}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </TableCell>

            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}