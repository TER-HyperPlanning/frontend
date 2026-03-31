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
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              Nom de la formation
            </TableHeader>
            <TableHeader>
              Enseignant responsable
            </TableHeader>
            <TableHeader>
              Programme
            </TableHeader>
            <TableHeader>
              Lieu
            </TableHeader>
            <TableHeader>
              Filière associée
            </TableHeader>
            <TableHeader>
              Actions
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {formations.map(formation => (
            <TableRow key={formation.id}>
              <TableCell className="font-medium text-base-content">{formation.nom}</TableCell>
              <TableCell className="text-sm text-base-content/80">
                {formation.enseignantResponsable}
              </TableCell>
              <TableCell className="text-sm text-base-content/80">{formation.programme}</TableCell>
              <TableCell className="text-sm text-base-content/80">{formation.lieu}</TableCell>
              <TableCell className="text-sm text-base-content/80">{formation.filiere.nom}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(formation)}
                    className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                  >
                    <PencilSquareIcon className="size-5" />
                  </button>
                  <button
                    onClick={() => onDelete(formation)}
                    className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {formations.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                Aucune formation enregistrée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
