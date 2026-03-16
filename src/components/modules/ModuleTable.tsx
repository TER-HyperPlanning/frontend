import React from "react";
import { Pencil, Trash2 } from "lucide-react";

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
    <div className="overflow-x-auto bg-gray-100 p-6 rounded-xl">

      <table className="w-full bg-gray-100 border-collapse">

        <thead className="text-blue-900 font-bold text-lg uppercase">
          <tr>
            <th className="px-6 py-3 text-left border-b-2 border-gray-400">Nom</th>
            <th className="px-6 py-3 text-left border-b-2 border-gray-400">Code</th>
            <th className="px-6 py-3 text-left border-b-2 border-gray-400">Volume horaire</th>
            <th className="px-6 py-3 text-left border-b-2 border-gray-400">Intervenant</th>
            <th className="px-6 py-3 text-left border-b-2 border-gray-400">Actions</th>
          </tr>
        </thead>

        <tbody className="text-blue-900 font-bold text-lg uppercase border-b-2 border-gray-400">
          {modules.map((module) => (
            <tr
              key={module.id}
              className="border-b-2 border-gray-300 hover:bg-blue-50 transition"
            >

              <td className="font-bold text-blue-900 text-lg px-6 py-3 border-b border-gray-400">
                {module.name}
              </td>

              <td className="font-bold text-blue-800 text-lg px-6 py-3 border-b border-gray-400">
                {module.code}
              </td>

              <td className="font-bold text-blue-800 text-lg px-6 py-3 border-b border-gray-400">
                {module.volume}
              </td>

              <td className="font-bold text-blue-800 text-lg px-6 py-3 border-b border-gray-400">
                {module.teacher}
              </td>

              <td className="space-x-2 px-6 py-3">

                <button
                  className="btn btn-ghost"
                  onClick={() => onEdit(module)}
                >
                  <Pencil size={25} />
                </button>

                <button
                  className="btn btn-ghost text-black"
                  onClick={() => onDelete(module.id)}
                >
                  <Trash2 size={25} />
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}