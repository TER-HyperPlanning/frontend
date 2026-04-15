import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import Button from '../Button';
import type { Building } from "@/hooks/api/buildings";
import { useUpdateBuilding } from "@/hooks/buildings/useUpdateBuilding";

interface EditBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
  onSuccess: (message: string) => void;
}

export default function EditBuildingModal({ isOpen, onClose, building, onSuccess }: EditBuildingModalProps) {
  const [buildingName, setBuildingName] = useState('');
  const [error, setError] = useState('');

  const { mutate: updateBuilding, isPending } = useUpdateBuilding();

  useEffect(() => {
    if (building) {
      setBuildingName(building.name);
      setError('');
    }
  }, [building, isOpen]);

  if (!isOpen || !building) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = buildingName.trim();

    // Validations locales
    if (trimmedName.length < 3) {
      setError('Le nom du bâtiment doit contenir au moins 3 caractères.');
      return;
    }
    if (trimmedName.length > 50) {
      setError("Le nom du bâtiment ne peut pas dépasser 50 caractères.");
      return;
    }

    // --- APPEL API ---
    updateBuilding(
      { id: building.id, name: trimmedName },
      {
        onSuccess: () => {
          onSuccess(`Le bâtiment a été renommé en "${trimmedName}" avec succès !`);
          onClose();
        },
        onError: (err: any) => {
          console.error("Erreur API:", err);

          const apiError = err?.response?.data;

          let message = "Une erreur est survenue";

          if (apiError?.message) {

            if (apiError.message === "Building already exists, choose another name") {
              message = "Ce bâtiment existe déjà, veuillez choisir un autre nom";
            }

            else if (apiError.message === "Building content is required") {
              message = "Le contenu du bâtiment est requis";
            }

            else if (apiError.message.includes("not found")) {
              message = "Bâtiment introuvable";
            }

            else {
              message = apiError.message;
            }
          }

          setError(message);
        }
      }
    );
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400"
          disabled={isPending}
        >
          <HiX size={20} />
        </button>

        <h3 className="font-bold text-xl text-[#003366] mb-6">Modifier le bâtiment</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-control w-full">
            <label className="label text-xs font-bold text-gray-500 uppercase tracking-wider">
              Nom du bâtiment
            </label>
            <input
              type="text"
              placeholder="Ex: Bâtiment IBGBI"
              className={`input bg-gray-50 border-none focus:ring-2 ${error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                } w-full text-[#003366] font-medium disabled:opacity-50`}
              value={buildingName}
              onChange={(e) => {
                setBuildingName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              disabled={isPending}
            />
            {error && (
              <span className="text-red-500 text-xs mt-2 font-medium">
                {error}
              </span>
            )}
          </div>

          <div className="modal-action flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="btn btn-ghost text-gray-500 flex-1 border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
            >
              Annuler
            </button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#003366] hover:bg-[#002244] text-white flex-1 shadow-lg"
            >
              {isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>

      {/* Overlay de fond */}
      <div
        className="modal-backdrop bg-black/30 backdrop-blur-sm"
        onClick={!isPending ? onClose : undefined}
      ></div>
    </div>
  );
}