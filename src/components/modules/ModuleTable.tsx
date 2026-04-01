import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";

type Module = {
  id: string;
  name: string;
  code: string;
  formationId?: string;
  volume?: string;
  teacher?: string;
};

type Props = {
  modules: Module[];
  onDelete: (id: string) => void;
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
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {modules.length > 0 ? (
          modules.map((module) => (
            <TableRow key={module.id}>
              <TableCell className="font-medium text-base-content">
                {module.name}
              </TableCell>

              <TableCell>
                <span className="badge badge-secondary badge-outline badge-sm font-medium">
                  {module.code}
                </span>
              </TableCell>

              <TableCell className="text-sm text-base-content/80">
                {module.volume ?? <span className="text-base-content/40 italic">—</span>}
              </TableCell>

              <TableCell className="text-sm text-base-content/80">
                {module.teacher ?? <span className="text-base-content/40 italic">Non assigné</span>}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <button
                    className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                    onClick={() => onEdit(module)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                    onClick={() => onDelete(module.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="py-16 text-center text-base-content/50">
              Aucun module trouvé.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}