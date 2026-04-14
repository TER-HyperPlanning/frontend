import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ModuleTable from "@/components/modules/ModuleTable";
import ModuleForm from "@/components/modules/ModuleForm";
import PageLayout from "@/layout/PageLayout";
import toast from "react-hot-toast";
import { Bell, Search } from "lucide-react";
import { useCourses } from "@/hooks/modules/useCourses";

export const Route = createFileRoute("/(app)/modules/")({
  component: ModulesPage,
});

type Module = {
  id: string;
  name: string;
  code: string;
  formationId?: string;
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
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();

  const [selectedFormation, setSelectedFormation] = useState("1");
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddOrUpdate = async (data: {
    name: string;
    code: string;
    formationId: string;
  }) => {
    try {
      if (editingModule) {
        await updateCourse({
          id: editingModule.id,
          data: {
            name: data.name,
            code: data.code,
          },
        });

        setEditingModule(null);
        toast.success("Module modifié avec succès");
      } else {
        await createCourse({
          name: data.name,
          code: data.code,
        });

        toast.success("Module ajouté avec succès");
      }
    } catch {
      toast.error("Erreur lors de l'opération");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce module ?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);
      toast.success("Module supprimé avec succès");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  // Adaptation des données backend Courses -> UI Modules
  const modules: Module[] = courses.map((course) => ({
    id: course.id,
    name: course.name,
    code: course.code,
    formationId: selectedFormation,
    volume: "—",
    teacher: "Non assigné",
  }));

  // Pour l'instant, Courses ne permet pas encore de filtrer réellement par formation
  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-theme="light">
      <PageLayout className="p-4 space-y-4">
        <PageHeader onOpenModal={() => setIsModalOpen(true)} />

        <div className="flex items-center justify-between mb-4">
          <div className="relative w-150">
            <Search
              size={22}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-800 z-10"
            />

            <input
              type="text"
              placeholder="Rechercher un module..."
              className="input input-bordered w-full pl-12 text-blue-950 font-bold text-lg placeholder:text-blue-800 rounded-xl bg-gray-100 border-none"
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

        <div className="card bg-base-100 border border-base-200">
          <div className="overflow-x-auto">
            <ModuleTable
              modules={filteredModules}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>

        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {editingModule ? "Modifier le module" : "Nouveau Module"}
              </h3>

              <ModuleForm
                onSubmit={async (data) => {
                  await handleAddOrUpdate(data);
                  setIsModalOpen(false);
                }}
                editingModule={editingModule}
                selectedFormation={selectedFormation}
              />

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingModule(null);
                  }}
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