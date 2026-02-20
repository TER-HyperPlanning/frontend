import React from "react";

type Module = {
  id: number;
  name: string;
  code: string;
  formationId: string;
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
        <thead>
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module.id}>
              <td>{module.name}</td>
              <td>{module.code}</td>
              <td className="space-x-2">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => onEdit(module)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => onDelete(module.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}