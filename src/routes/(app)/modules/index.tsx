import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ModuleTable from "@/components/modules/ModuleTable";
import ModuleForm from "@/components/modules/ModuleForm";

export const Route = createFileRoute("/(app)/modules/")({
  component: ModulesPage,
});

type Module = {
  id: number;
  name: string;
  code: string;
  formationId: string;
};

const formations = [
  { id: "1", name: "Informatique" },
  { id: "2", name: "Réseaux" },
];

function ModulesPage() {
  const [selectedFormation, setSelectedFormation] = useState("1");

  const [modules, setModules] = useState<Module[]>([
    { id: 1, name: "Algorithme", code: "ALG101", formationId: "1" },
    { id: 2, name: "Base de données", code: "BDD202", formationId: "1" },
    { id: 3, name: "Réseaux TCP/IP", code: "NET101", formationId: "2" },
  ]);

  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const handleAddOrUpdate = (data: {
    name: string;
    code: string;
    formationId: string;
  }) => {
    if (editingModule) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === editingModule.id ? { ...m, ...data } : m
        )
      );
      setEditingModule(null);
    } else {
      setModules((prev) => [
        ...prev,
        { id: Date.now(), ...data },
      ]);
    }
  };

  const handleDelete = (id: number) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
  };

  const filteredModules = modules.filter(
    (m) => m.formationId === selectedFormation
  );

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">
        Gestion des modules
      </h1>

      {/* Select formation */}
      <div className="bg-base-100 p-4 rounded-xl shadow">
        <label className="block mb-2 font-medium">
          Sélectionner une formation
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedFormation}
          onChange={(e) => setSelectedFormation(e.target.value)}
        >
          {formations.map((formation) => (
            <option key={formation.id} value={formation.id}>
              {formation.name}
            </option>
          ))}
        </select>
      </div>

      <ModuleForm
        onSubmit={handleAddOrUpdate}
        editingModule={editingModule}
        selectedFormation={selectedFormation}
      />

      <ModuleTable
        modules={filteredModules}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}