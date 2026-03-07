import React from "react";
import { Pencil, Trash2 } from "lucide-react";

type Module = {
  id: number;
  name: string;
  code: string;
  formationId: string;
  volume?: string;
  teacher?: string; // AJOUT
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
    <div className="overflow-x-auto bg-base-100 p-6 rounded-xl shadow">
      <table className="table">
        <thead className="bg-blue-900 text-white uppercase">
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Volume horaire</th>
            <th>Intervenant</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {modules.map((module) => (
            <tr key={module.id}>
              <td className="font-bold uppercase text-black">
                {module.name}
              </td>

              <td>
  <span className="badge bg-blue-500 text-white font-bold">
    {module.code}
  </span>
</td>

<td>
  <span className="badge bg-blue-500 text-white font-bold">
    {module.volume}
  </span>
</td>

<td>
  <span className="badge bg-blue-500 text-white font-bold">
    {module.teacher}
  </span>
</td>

              <td className="space-x-2">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onEdit(module)}
                >
                  <Pencil size={18} />
                </button>

                <button
                  className="btn btn-ghost btn-sm text-red-500"
                  onClick={() => onDelete(module.id)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}