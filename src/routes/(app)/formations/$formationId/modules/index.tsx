import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ModuleTable from "@/components/modules/ModuleTable";
import ModuleForm from "@/components/modules/ModuleForm";
import PageLayout from "@/layout/PageLayout";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { useCourses } from "@/hooks/modules/useCourses";
import { useAssign } from "@/hooks/modules/useAssign";
import { useTracks } from "@/hooks/modules/useTracks";
import Logo from "@/components/Logo";

export const Route = createFileRoute("/(app)/formations/$formationId/modules/")({
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
  const { formationId } = Route.useParams();
  const selectedTrackId = formationId;

  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();
  const { assigns, createAssign, updateAssign, deleteAssign } = useAssign();
  const { tracks } = useTracks();

  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId);

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
          trackId: selectedTrackId,
          courseId: editingModule.id,
          hourlyVolume: parsedVolume,
        });

        setEditingModule(null);
        toast.success("Module modifié avec succès");
        setRefreshKey((prev) => prev + 1);
        return;
      }

      const existingCourse = courses.find(
        (course) =>
          course.code.trim().toLowerCase() === data.code.trim().toLowerCase()
      );

      if (existingCourse) {
        const alreadyAssigned = assigns.some(
          (a) =>
            a.trackId === selectedTrackId &&
            a.courseId === existingCourse.id
        );

        if (alreadyAssigned) {
          toast.error("Ce module existe déjà dans cette formation");
          return;
        }

        await createAssign({
          trackId: selectedTrackId,
          courseId: existingCourse.id,
          hourlyVolume: parsedVolume,
        });

        toast.success("Module ajouté à la formation avec succès");
        setRefreshKey((prev) => prev + 1);
        return;
      }

      const createdCourse = await createCourse({
        name: data.name,
        code: data.code,
      });

      await createAssign({
        trackId: selectedTrackId,
        courseId: createdCourse.id,
        hourlyVolume: parsedVolume,
      });

      toast.success("Module ajouté avec succès");
      setRefreshKey((prev) => prev + 1);
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
        trackId: selectedTrackId,
        courseId: id,
      });

      if (relatedAssigns.length === 1) {
        await deleteCourse(id);
        toast.success("Module supprimé avec succès");
      } else {
        toast.success("Module retiré de cette formation avec succès");
      }

      setRefreshKey((prev) => prev + 1);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  refreshKey;

  const modules: Module[] = courses.map((course) => {
    const assign = assigns.find(
      (a) => a.courseId === course.id && a.trackId === selectedTrackId
    );

    return {
      id: course.id,
      name: course.name,
      code: course.code,
      formationId: selectedTrackId,
      volume: assign ? `${assign.hourlyVolume}h` : "—",
      teacher: "Non assigné",
    };
  });

  const filteredModules = modules.filter((m) => {
    const isInFormation = assigns.some(
      (a) => a.trackId === selectedTrackId && a.courseId === m.id
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
              Formation sélectionnée
            </label>

            <div className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700">
              {selectedTrack?.name || "Aucune formation sélectionnée"}
            </div>
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
                selectedFormation={selectedTrackId}
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