import { useState } from 'react';
import { HiPlus, HiOutlineTrash, HiX } from 'react-icons/hi';
import Button from '../Button';

interface Room {
  number: string;
  capacity: string;
  type: string;
}


interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const ROOM_TYPES = ['TD', 'Info', 'Amphi', 'Labo'];

export default function AddBuildingModal({ isOpen, onClose, onSuccess }: AddBuildingModalProps) {
  const [buildingName, setBuildingName] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [errors, setErrors] = useState<{ buildingName?: string; rooms?: string[] }>({});

  if (!isOpen) return null;

  // Ajouter une salle
  const addRoom = () => {
    setRooms([...rooms, { number: '', capacity: '', type: 'TD' }]);
  };

  // Supprimer une salle
  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
    setErrors(prev => ({
      ...prev,
      rooms: prev.rooms?.filter((_, i) => i !== index)
    }));
  };

  // Mettre à jour une salle
  const updateRoom = (index: number, field: keyof Room, value: string) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setRooms(newRooms);
  };

  // Validation simple
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!buildingName.trim()) {
      newErrors.buildingName = "Le nom du bâtiment est obligatoire";
    }
    if (!buildingName.trim()) {
      newErrors.buildingName = "Le nom du bâtiment est obligatoire";
    } else if (!/^[A-Za-z0-9\- ]+$/.test(buildingName)) {
      newErrors.buildingName = "Le nom du bâtiment contient des caractères invalides";
    } else if (buildingName.length < 3) {
      newErrors.buildingName = "Le nom du bâtiment doit faire au moins 3 caractères";
    } else if (buildingName.length > 50) {
      newErrors.buildingName = "Le nom du bâtiment ne peut pas dépasser 50 caractères";
    }

    if (rooms.length > 0) {
      newErrors.rooms = rooms.map(room => {
        if (!room.number.trim()) return "Salle obligatoire";
        if (!/^[A-Za-z0-9\- ]+$/.test(room.number)) return "Numéro invalide";
        if (!room.capacity || Number(room.capacity) <= 0) return "Capacité requise";
        if (!Number.isInteger(Number(room.capacity))) return "Capacité doit être un entier";
        if (Number(room.capacity) > 500) return "Capacité max 500";
        if (!ROOM_TYPES.includes(room.type)) return "Type invalide";
        return "";
      });
      if (newErrors.rooms.every(e => e === "")) {
        delete newErrors.rooms;
      }
    }

    setErrors(newErrors);

    // Retourne true si pas d'erreurs
    return !newErrors.buildingName && (!newErrors.rooms || newErrors.rooms.every(e => e === ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log({ buildingName, rooms });

    onSuccess?.(`Bâtiment "${buildingName}" ajouté avec succès !`);

    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400"
        >
          <HiX size={20} />
        </button>

        <h3 className="font-bold text-xl text-[#003366] mb-6">Nouveau bâtiment</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nom du bâtiment */}
          <div className="form-control w-full">
            <input
              type="text"
              placeholder="Nom du bâtiment"
              className="input bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 w-full"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
            />
            {errors.buildingName && (
              <p className="text-red-500 text-sm mt-1">{errors.buildingName}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-600 font-medium">
                Vous pouvez ajouter les salles de ce bâtiment en cliquant sur
              </p>
              <button
                type="button"
                onClick={addRoom}
                className="btn btn-circle btn-sm bg-blue-500 hover:bg-blue-600 border-none text-white shadow-md"
              >
                <HiPlus size={18} />
              </button>
            </div>

            {/* Liste dynamique des salles */}
            <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
              {rooms.map((room, index) => (
                <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <div className="flex flex-col w-1/3">
                    <input
                      type="text"
                      placeholder="Numéro salle"
                      className="input input-sm bg-gray-50 border-none w-full"
                      value={room.number}
                      onChange={(e) => updateRoom(index, 'number', e.target.value)}
                    />
                    {errors.rooms && errors.rooms[index] && (
                      <p className="text-red-500 text-xs mt-0.5">{errors.rooms[index]}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/4">
                    <input
                      type="number"
                      placeholder="Capacité"
                      className="input input-sm bg-gray-50 border-none w-full"
                      value={room.capacity}
                      onChange={(e) => updateRoom(index, 'capacity', e.target.value)}
                    />
                  </div>

                  <select
                    className="select select-sm bg-gray-50 border-none w-1/3"
                    value={room.type}
                    onChange={(e) => updateRoom(index, 'type', e.target.value)}
                  >
                    {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeRoom(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-action flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-gray-500 flex-1 border border-gray-200"
            >
              Annuler
            </button>
            <Button
              type="submit"
              className="bg-[#003366] hover:bg-[#002244] text-white flex-1"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );

}
