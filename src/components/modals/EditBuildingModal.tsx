import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import Button from '../Button';

interface Building {
  id: number;
  name: string;
}

interface EditBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
  onSuccess: (message: string) => void;
}

export default function EditBuildingModal({ isOpen, onClose, building, onSuccess }: EditBuildingModalProps) {
  const [buildingName, setBuildingName] = useState('');
  const [error, setError] = useState('');

  // Synchronise le nom avec le bâtiment sélectionné à l'ouverture
  useEffect(() => {
    if (building) {
      setBuildingName(building.name);
      setError('');
    }
  }, [building, isOpen]);

  if (!isOpen || !building) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (buildingName.trim().length < 3) {
      setError('Le nom du bâtiment doit contenir au moins 3 caractères.');
      return;
    }

    // Ici la logique d'appel API (TanStack Query ou autre)
    console.log("Modification du bâtiment ID:", building.id, "Nouveau nom:", buildingName);
    
    onSuccess(`Le bâtiment a été renommé en "${buildingName}" avec succès !`);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
        {/* Bouton Fermer */}
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400"
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
              className={`input bg-gray-50 border-none focus:ring-2 ${
                error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
              } w-full text-[#003366] font-medium`}
              value={buildingName}
              onChange={(e) => {
                setBuildingName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
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
              className="btn btn-ghost text-gray-500 flex-1 border border-gray-200 hover:bg-gray-100"
            >
              Annuler
            </button>
            <Button 
              type="submit" 
              className="bg-[#003366] hover:bg-[#002244] text-white flex-1 shadow-lg"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>

      {/* Overlay de fond */}
      <div 
        className="modal-backdrop bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
    </div>
  );
}