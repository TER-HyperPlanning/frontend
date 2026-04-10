import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'

type Module = {
  id: number;
  name: string;
  code: string;
  formationId: string;
  volume?: string;
  teacher?: string;
};

type Props = {
  modules: Module[];
  onDelete: (id: number) => void;
  onEdit: (module: Module) => void;
};

export default function ModuleTable({
  modules,
  onDelete,
  onEdit,
}: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nom</TableHeader>
          <TableHeader>Code</TableHeader>
          <TableHeader>Volume horaire</TableHeader>
          <TableHeader>Intervenant</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {modules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="px-4 py-0">
              <EmptyState 
                title="Aucun module"
                message="Aucun module enregistré pour le moment"
              />
            </TableCell>
          </TableRow>
        ) : (
          modules.map((module) => (
            <TableRow key={module.id}>
              <TableCell className="font-semibold text-gray-900">
                {module.name}
              </TableCell>

              <TableCell>
                <span className={BADGE_STYLES['secondary-outline']}>
                  {module.code}
                </span>
              </TableCell>

              <TableCell className="text-gray-600">
                {module.volume ?? <span className="text-gray-400 italic">—</span>}
              </TableCell>

              <TableCell className="text-gray-600">
                {module.teacher ?? <span className="text-gray-400 italic">Non assigné</span>}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    className={ACTION_BUTTON_STYLES.edit}
                    onClick={() => onEdit(module)}
                    title="Modifier"
                    aria-label="Modifier module"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className={ACTION_BUTTON_STYLES.delete}
                    onClick={() => onDelete(module.id)}
                    title="Supprimer"
                    aria-label="Supprimer module"
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
  );
}
