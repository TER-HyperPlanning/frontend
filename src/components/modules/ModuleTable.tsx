import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'

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
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Nom</TableHeader>
            <TableHeader>Code</TableHeader>
            <TableHeader>Volume horaire</TableHeader>
            <TableHeader>Intervenant</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {modules.map((module) => (
            <TableRow key={module.id}>
              <TableCell className="font-medium text-base-content">
                {module.name}
              </TableCell>

              <TableCell className="text-sm text-base-content/80">
                {module.code}
              </TableCell>

              <TableCell className="text-sm text-base-content/80">
                {module.volume}
              </TableCell>

              <TableCell className="text-sm text-base-content/80">
                {module.teacher}
              </TableCell>

              <TableCell>
                <button
                  className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                  onClick={() => onEdit(module)}
                >
                  <Pencil size={18} />
                </button>

                <button
                  className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                  onClick={() => onDelete(module.id)}
                >
                  <Trash2 size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}