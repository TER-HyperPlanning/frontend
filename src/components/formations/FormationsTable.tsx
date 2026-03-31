import { type Formation } from '@/types/formation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

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
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {formations.map(formation => (
            <TableRow key={formation.id}>
              <TableCell className="font-medium text-base-content">{formation.nom}</TableCell>
              <TableCell className="text-sm text-base-content/80">
                {formation.enseignantResponsable}
              </TableCell>
              <TableCell>
                <span className="badge badge-ghost badge-sm font-medium">
                  {formation.programme}
                </span>
              </TableCell>
              <TableCell className="text-sm text-base-content/80">{formation.lieu}</TableCell>
              <TableCell>
                <span className="badge badge-primary badge-outline badge-sm font-medium">
                  {formation.filiere.nom}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(formation)}
                    className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                  >
                    <PencilSquareIcon className="size-4" />
                  </button>
                  <button
                    onClick={() => onDelete(formation)}
                    className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {formations.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-base-content/50 py-16">
                Aucune formation enregistrée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  )
}
