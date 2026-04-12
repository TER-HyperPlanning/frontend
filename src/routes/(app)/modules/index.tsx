import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ModuleTable from "@/components/modules/ModuleTable";
import ModuleForm from "@/components/modules/ModuleForm";
import PageLayout from "@/layout/PageLayout";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { useCourses } from "@/hooks/modules/useCourses";
import { useAssign } from "@/hooks/modules/useAssign";
import { useTracks } from "@/hooks/modules/useTracks";
import Logo from "@/components/Logo";

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

function PageHeader({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <Logo showText={true} className="h-18 w-auto text-primary-700" />

      <div className="flex items-center gap-4">
        <button
          className="btn bg-blue-900 text-white hover:bg-blue-800 rounded-xl"
          onClick={onOpenModal}
        >
          + Nouveau Module
        </button>
      </div>
    </div>
  );
}

function ModulesPage() {
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();
  const { assigns, createAssign, updateAssign, deleteAssign } = useAssign();
  const { tracks } = useTracks();

  const [selectedFormation, setSelectedFormation] = useState("");
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedFormation && tracks.length > 0) {
      setSelectedFormation(tracks[0].id);
    }
  }, [tracks, selectedFormation]);

  const handleAddOrUpdate = async (data: {
  name: string;
  code: string;
  formationId: string;
  volume?: string;
  teacher?: string;
}) => {
  try {
    const parsedVolume =
      Number.parseInt((data.volume || "0").replace(/\D/g, ""), 10) || 0;

    if (editingModule) {
      await updateCourse({
        id: editingModule.id,
        data: {
          name: data.name,
          code: data.code,
        },
      });

      await updateAssign({
        trackId: selectedFormation,
        courseId: editingModule.id,
        hourlyVolume: parsedVolume,
      });

      setEditingModule(null);
      toast.success("Module modifié avec succès");
      return;
    }

    //  CAS AJOUT
    // On cherche d'abord si le module existe déjà globalement
    const existingCourse = courses.find(
      (course) => course.code.trim().toLowerCase() === data.code.trim().toLowerCase()
    );

    if (existingCourse) {
      // Vérifie s'il est déjà assigné à la formation courante
      const alreadyAssigned = assigns.some(
        (a) =>
          a.trackId === selectedFormation &&
          a.courseId === existingCourse.id
      );

      if (alreadyAssigned) {
        toast.error("Ce module existe déjà dans cette formation");
        return;
      }

      // Le module existe déjà globalement → on crée seulement le lien Assign
      await createAssign({
        trackId: selectedFormation,
        courseId: existingCourse.id,
        hourlyVolume: parsedVolume,
      });

      toast.success("Module ajouté à la formation avec succès");
      return;
    }

    // Sinon, on crée d'abord le module puis son assignation
    const createdCourse = await createCourse({
      name: data.name,
      code: data.code,
    });

    await createAssign({
      trackId: selectedFormation,
      courseId: createdCourse.id,
      hourlyVolume: parsedVolume,
    });

    toast.success("Module ajouté avec succès");
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
    const relatedAssigns = assigns.filter((a) => a.courseId === id);

    await deleteAssign({
      trackId: selectedFormation,
      courseId: id,
    });

    if (relatedAssigns.length === 1) {
      await deleteCourse(id);
      toast.success("Module supprimé avec succès");
    } else {
      toast.success("Module retiré de cette formation avec succès");
    }
  } catch {
    toast.error("Erreur lors de la suppression");
  }
};

     

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  const modules: Module[] = courses.map((course) => {
    const assign = assigns.find(
      (a) => a.courseId === course.id && a.trackId === selectedFormation
    );

    return {
      id: course.id,
      name: course.name,
      code: course.code,
      formationId: selectedFormation,
      volume: assign ? `${assign.hourlyVolume}h` : "—",
      teacher: "Non assigné",
    };
  });

  const filteredModules = modules.filter((m) => {
    const isInFormation = assigns.some(
      (a) => a.trackId === selectedFormation && a.courseId === m.id
    );

    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase());

    return isInFormation && matchesSearch;
  });

  return (
    <div data-theme="light">
      <PageLayout className="p-4 space-y-4">
        <PageHeader onOpenModal={() => setIsModalOpen(true)} />

        <div className="flex items-center justify-between mb-4">
          <div className="relative w-[600px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Rechercher un module..."
              className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md bg-white text-gray-700 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-[420px] shrink-0">
            <label className="mr-2 font-medium block mb-2">
              Sélectionner une formation
            </label>

            <select
              className="select select-bordered w-full"
              value={selectedFormation}
              onChange={(e) => setSelectedFormation(e.target.value)}
            >
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
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