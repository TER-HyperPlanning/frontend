import { type Formation } from '@/types/formation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import {
  PencilSquareIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { UsersRound, BookOpen } from 'lucide-react'

interface FormationsTableProps {
  formations: Formation[]
  isLoading: boolean
  onEdit: (formation: Formation) => void
  onDelete: (formation: Formation) => void
  onViewProgramme: (formation: Formation) => void
  onViewGroups: (formation: Formation) => void
  onViewModules: (formation: Formation) => void
}

export default function FormationsTable({
  formations,
  isLoading,
  onEdit,
  onDelete,
  onViewProgramme,
  onViewGroups,
  onViewModules,
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
        <p className="text-base-content/50 text-sm">
          Aucune formation enregistrée
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow className="text-base-content/60 text-xs uppercase">
          <TableHeader>Nom de la formation</TableHeader>
          <TableHeader>Enseignant responsable</TableHeader>
          <TableHeader>Lieu</TableHeader>
          <TableHeader>Filière associée</TableHeader>
          <TableHeader className="whitespace-nowrap">Consultation</TableHeader>
          <TableHeader className="whitespace-nowrap">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {formations.map((formation) => (
          <TableRow key={formation.id}>
            <TableCell className="font-medium text-base-content">
              {formation.nom}
            </TableCell>
            <TableCell className="text-sm text-base-content/80">
              {formation.enseignantResponsable || '—'}
            </TableCell>
            <TableCell className="text-sm text-base-content/80">
              {formation.lieu || '—'}
            </TableCell>
            <TableCell className="text-sm text-base-content/80">
              {formation.filiere.nom || '—'}
            </TableCell>
            <TableCell className="w-0">
              <div className="flex items-center justify-end gap-0.5 min-w-0">
                <button
                  type="button"
                  onClick={() => onViewProgramme(formation)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-info"
                  title="Voir le programme"
                >
                  <InformationCircleIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onViewGroups(formation)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary"
                  title="Voir les groupes"
                >
                  <UsersRound size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModules(formation)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-secondary"
                  title="Voir les modules"
                >
                  <BookOpen size={16} />
                </button>
              </div>
            </TableCell>
            <TableCell className="w-0">
              <div className="flex items-center justify-end gap-0.5 min-w-0">
                <button
                  type="button"
                  onClick={() => onEdit(formation)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary"
                  title="Modifier"
                >
                  <PencilSquareIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(formation)}
                  className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-error"
                  title="Supprimer"
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
