import { type Formation } from '@/types/formation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { Pencil, Trash2 } from 'lucide-react'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'

interface FormationsTableProps {
  formations: Formation[]
  onEdit: (formation: Formation) => void
  onDelete: (formation: Formation) => void
}

export default function FormationsTable({
  formations,
  onEdit,
  onDelete,
}: FormationsTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nom de la formation</TableHeader>
          <TableHeader>Enseignant responsable</TableHeader>
          <TableHeader>Programme</TableHeader>
          <TableHeader>Lieu</TableHeader>
          <TableHeader>Filière associée</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {formations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="px-4 py-0">
              <EmptyState 
                title="Aucune formation"
                message="Aucune formation enregistrée pour le moment"
              />
            </TableCell>
          </TableRow>
        ) : (
          formations.map(formation => (
            <TableRow key={formation.id}>
              <TableCell className="font-semibold text-gray-900">{formation.nom}</TableCell>
              <TableCell className="text-gray-600">
                {formation.enseignantResponsable}
              </TableCell>
              <TableCell>
                <span className={BADGE_STYLES['secondary-outline']}>
                  {formation.programme}
                </span>
              </TableCell>
              <TableCell className="text-gray-600">{formation.lieu}</TableCell>
              <TableCell>
                <span className={BADGE_STYLES['info-outline']}>
                  {formation.filiere.nom}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(formation)}
                    className={ACTION_BUTTON_STYLES.edit}
                    title="Modifier"
                    aria-label="Modifier formation"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(formation)}
                    className={ACTION_BUTTON_STYLES.delete}
                    title="Supprimer"
                    aria-label="Supprimer formation"
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
