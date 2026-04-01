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

function PageHeader({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <img
        src="/logo_evry.png"
        alt="Université Evry"
        className="h-18"
      />

      <div className="flex items-center gap-4">
        <button
          className="btn bg-blue-900 text-white hover:bg-blue-800 rounded-xl"
          onClick={onOpenModal}
        >
          + Nouveau Module
        </button>

        <Bell size={26} className="text-gray-700" />
      </div>
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

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const filteredModules = modules.filter(
    (m) =>
      m.formationId === selectedFormation &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-theme="light">

      <PageLayout className="p-4 space-y-4">

        <PageHeader onOpenModal={() => setIsModalOpen(true)} />

        {/* Recherche + formation */}
        <div className="flex items-center justify-between mb-4">

          <div className="relative w-150">

  <Search
    size={22}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-800 z-10"
  />

  <input
    type="text"
    placeholder="Rechercher un module..."
    className="input input-bordered w-full pl-12 text-blue-950 font-bold text-lg placeholder:text-blue-800 rounded-xl  bg-gray-100 border-none"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>

          <div>
            <label className="mr-2 font-medium">
              Sélectionner une formation
            </label>

            <select
              className="select select-bordered"
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

        {/* Module Table */}
        <div className="card bg-base-100 border border-base-200">
          <div className="overflow-x-auto">
            <ModuleTable
              modules={filteredModules}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>

        {/* Modal Nouveau Module */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">

              <h3 className="font-bold text-lg mb-4">
                Nouveau Module
              </h3>

              <ModuleForm
                onSubmit={(data) => {
                  handleAddOrUpdate(data);
                  setIsModalOpen(false);
                }}
                editingModule={editingModule}
                selectedFormation={selectedFormation}
              />

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
              </div>

            </div>
          </div>
        )}

      </PageLayout>

    </div>
  );
}