import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ModuleTable from "@/components/modules/ModuleTable";
import ModuleForm from "@/components/modules/ModuleForm";
import PageLayout from "@/layout/PageLayout";
import toast from "react-hot-toast";
import { Bell, Search } from "lucide-react";

export const Route = createFileRoute("/(app)/modules/")({
  component: ModulesPage,
});

type Module = {
  id: number;
  name: string;
  code: string;
  formationId: string;
  volume?: string;
  teacher?: string;
};

const formations = [
  { id: "1", name: "Ingenierie Logicielle pour le web" },
  { id: "2", name: "CNS" },
];

function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <img
        src="/logo_evry.png"
        alt="Université Evry"
        className="h-18"
      />

      <h1 className="text-2xl font-bold text-center flex-1">
        Gestion des modules
      </h1>

      <Bell size={26} className="text-gray-700" />
    </div>
  );
}


function ModulesPage() {
  const [selectedFormation, setSelectedFormation] = useState("1");

  const [modules, setModules] = useState<Module[]>([
    { id: 1, name: "Analyse de données", code: "ADD101", formationId: "1" },
    { id: 2, name: "Programmation des applications", code: "PDA202", formationId: "1" },
    { id: 3, name: "Administration des systèmes et réseaux", code: "ASR101", formationId: "2" },
    { id: 4, name: "Systemes repartis", code: "SR101", formationId: "2" },
  ]);

  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const [search, setSearch] = useState("");

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

      toast.success("Module modifié avec succès");
    } else {
      setModules((prev) => [
        ...prev,
        { id: Date.now(), ...data },
      ]);

      toast.success("Module ajouté avec succès");
    }
  };

  const handleDelete = (id: number) => {

    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce module ?");

    if (!confirmDelete) {
      return;
    }

    const moduleHasCourses = false;

    if (moduleHasCourses) {
      toast.error("Impossible de supprimer ce module car des cours sont planifiés");
      return;
    }

    setModules((prev) => prev.filter((m) => m.id !== id));

    toast.success("Module supprimé avec succès");
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
  };

  const filteredModules = modules.filter(
    (m) =>
      m.formationId === selectedFormation &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout className="p-4 space-y-4"> {/* MODIFIE */}

      <PageHeader />

      {/* Formation selector */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-4"> {/* MODIFIE */}
          <label className="font-medium mb-2">
            Sélectionner une formation
          </label>

          <select
            className="select select-bordered w-full max-w-xs"
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
      </div>

      {/* Module Form */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-4"> {/* MODIFIE */}
          <ModuleForm
            onSubmit={handleAddOrUpdate}
            editingModule={editingModule}
            selectedFormation={selectedFormation}
          />
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative w-full max-w-md">
  <Search
    size={20}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-800"
  />

  <input
    type="text"
    placeholder="Rechercher un module"
    className="input input-bordered w-full pl-10 text-blue-800 font-medium text-base"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      {/* Module Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-4"> {/* MODIFIE */}
          <ModuleTable
            modules={filteredModules}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>

    </PageLayout>
  );
}