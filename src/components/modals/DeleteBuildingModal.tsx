import { HiOutlineExclamation } from 'react-icons/hi';
import Button from '../Button';
import { useDeleteBuilding } from "@/hooks/buildings/useDeleteBuilding";
import type { Building } from "@/hooks/api/buildings";

interface DeleteBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
  onSuccess: (message: string) => void;
}

export default function DeleteBuildingModal({ isOpen, onClose, building, onSuccess }: DeleteBuildingModalProps) {
  // --- HOOK DE SUPPRESSION ---
  const { mutate: deleteBuilding, isPending } = useDeleteBuilding();

  if (!isOpen || !building) return null;

  const handleDelete = () => {
    // Utilisation de l'ID du bâtiment sélectionné
    deleteBuilding(building.id, {
      onSuccess: () => {
        onSuccess(`Le bâtiment "${building.name}" et toutes ses salles ont été supprimés.`);
        onClose();
      },
      onError: (error) => {
        console.error("Erreur lors de la suppression:", error);
        // Optionnel : vous pourriez afficher une notification d'erreur ici
      }
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white rounded-2xl p-0 overflow-hidden shadow-2xl border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <HiOutlineExclamation className="text-red-600" size={28} />
          </div>

          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
            Supprimer le bâtiment ?
          </h3>

          <p className="text-sm text-center text-gray-500 px-4">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-800">"{building.name}"</span> ?
            <br />
            <span className="text-red-500 font-medium mt-2 block">
              Attention : Cette action supprimera également toutes les salles rattachées à ce bâtiment de façon permanente.
            </span>
          </p>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="btn btn-ghost flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Annuler
          </button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white flex-1 shadow-md border-none"
          >
            {isPending ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}