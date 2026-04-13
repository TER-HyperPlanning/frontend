import { useNavigate } from '@tanstack/react-router'
import { type FiliereSummary } from '@/types/formation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Plus } from 'lucide-react'
import Button from '@/components/Button'

interface FilieresListProps {
  filieres: FiliereSummary[]
  isLoading: boolean
  onRenameFiliere: (f: FiliereSummary) => void
  onDeleteFiliere: (f: FiliereSummary) => void
  onDeleteFormation: (p: { id: string; name: string }) => void
}

export default function FilieresList({
  filieres,
  isLoading,
  onRenameFiliere,
  onDeleteFiliere,
  onDeleteFormation,
}: FilieresListProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 gap-3">
        <span className="loading loading-spinner loading-md text-primary" />
        <span className="text-base-content/60 text-sm">Chargement des filières…</span>
      </div>
    )
  }

  if (filieres.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-base-content/50 text-sm">Aucune filière enregistrée</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      {filieres.map((f) => (
        <section
          key={f.id}
          className="rounded-xl border border-base-200 bg-base-100/80 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-primary-900/5 border-b border-base-200">
            <h2 className="text-lg font-semibold text-primary-900">{f.nom}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outlined"
                leftIcon={<Plus size={16} />}
                onClick={() =>
                  navigate({
                    to: '/formations',
                    search: { filiereId: f.id },
                  })
                }
                className="border-primary-900/30 text-primary-900 hover:bg-primary-900/10"
              >
                Ajouter une formation
              </Button>
              <button
                type="button"
                onClick={() => onRenameFiliere(f)}
                className="btn btn-ghost btn-sm text-primary-900"
                title="Renommer la filière"
              >
                <PencilSquareIcon className="size-4" />
                Renommer
              </button>
              <button
                type="button"
                onClick={() => onDeleteFiliere(f)}
                className="btn btn-ghost btn-sm text-error"
                title="Supprimer la filière"
              >
                <TrashIcon className="size-4" />
                Supprimer
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {f.formations.length === 0 ? (
              <p className="text-sm text-base-content/50 px-4 py-6">
                Aucune formation liée — utilisez « Ajouter une formation ».
              </p>
            ) : (
              <Table>
                <TableHead>
                  <TableRow className="text-base-content/60 text-xs uppercase">
                    <TableHeader>Formation</TableHeader>
                    <TableHeader className="w-[120px]">Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {f.formations.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-base-content">{p.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              navigate({
                                to: '/formations',
                                search: { editId: p.id },
                              })
                            }
                            className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary"
                            title="Modifier"
                          >
                            <PencilSquareIcon className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteFormation({ id: p.id, name: p.name })}
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
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
