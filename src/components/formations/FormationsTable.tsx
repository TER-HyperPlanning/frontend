import { type Formation } from '@/types/formation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { Pencil, Trash2, UsersRound } from 'lucide-react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'

interface FormationsTableProps {
  formations: Formation[]
  isLoading: boolean
  onEdit: (formation: Formation) => void
  onDelete: (formation: Formation) => void
  onViewProgramme: (formation: Formation) => void
  onViewGroups: (formation: Formation) => void
}

export default function FormationsTable({
  formations,
  isLoading,
  onEdit,
  onDelete,
  onViewProgramme,
  onViewGroups,
}: FormationsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 gap-3">
        <span className="loading loading-spinner loading-md text-primary" />
        <span className="text-base-content/60 text-sm">
          Chargement des formations...
        </span>
      </div>
    )
  }

  if (formations.length === 0) {
    return (
      <div className="text-center py-16">
        <EmptyState 
          title="Aucune formation"
          message="Aucune formation enregistrée pour le moment"
        />
      </div>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow className="text-base-content/60 text-xs uppercase">
          <TableHeader>Nom de la formation</TableHeader>
          <TableHeader>Enseignant responsable</TableHeader>
          <TableHeader>Programme</TableHeader>
          <TableHeader>Lieu</TableHeader>
          <TableHeader>Filière associée</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {formations.map((formation) => (
          <TableRow key={formation.id}>
            <TableCell className="font-semibold text-base-content">
              {formation.nom}
            </TableCell>

            <TableCell className="text-sm text-base-content/80">
              {formation.enseignantResponsable || '—'}
            </TableCell>

            <TableCell>
              <span className={BADGE_STYLES['secondary-outline']}>
                {formation.programme}
              </span>
            </TableCell>

            <TableCell className="text-sm text-base-content/80">
              {formation.lieu || '—'}
            </TableCell>

            <TableCell>
              <span className={BADGE_STYLES['info-outline']}>
                {formation.filiere.nom || '—'}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                
                {/* Groups */}
                <button
                  onClick={() => onViewGroups(formation)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary"
                  title="Voir les groupes"
                >
                  <UsersRound size={16} />
                </button>

                {/* Programme */}
                <button
                  onClick={() => onViewProgramme(formation)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-info"
                  title="Voir le programme"
                >
                  <InformationCircleIcon className="size-4" />
                </button>

                {/* Edit */}
                <button
                  onClick={() => onEdit(formation)}
                  className={ACTION_BUTTON_STYLES.edit}
                  title="Modifier"
                >
                  <Pencil size={16} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(formation)}
                  className={ACTION_BUTTON_STYLES.delete}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}