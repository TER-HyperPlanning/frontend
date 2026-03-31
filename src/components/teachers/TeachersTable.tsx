import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'

import type { Teacher } from './types';

interface Props {
  teachers: Teacher[]
  onEditClick: (teacher: Teacher) => void
  onDeleteClick: (teacher: Teacher) => void
}

export default function TeachersTable({ teachers, onEditClick, onDeleteClick }: Props) {

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Nom</TableHeader>
            <TableHeader>Prénom</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Statut</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium text-base-content">{teacher.nom}</TableCell>
                <TableCell className="text-sm text-base-content/80">{teacher.prenom}</TableCell>
                <TableCell className="text-sm text-base-content/80">{teacher.email}</TableCell>
                <TableCell>
                  <span
                    className={`badge badge-sm font-medium ${
                      teacher.statut === 'Associé'
                        ? 'badge-primary badge-outline'
                        : teacher.statut === 'Vacataire'
                          ? 'badge-secondary badge-outline'
                          : 'badge-accent badge-outline'
                    }`}
                  >
                    {teacher.statut}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                      onClick={() => onEditClick(teacher)}
                    >
                      <HiOutlinePencil size={18} />
                    </button>

                    <button
                      className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                      onClick={() => onDeleteClick(teacher)}
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-16 text-center text-gray-400">
                Aucun enseignant trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}