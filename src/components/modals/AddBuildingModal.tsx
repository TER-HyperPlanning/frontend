import { useState } from 'react';
import { HiPlus, HiOutlineTrash, HiX } from 'react-icons/hi';
import Button from '../Button';
import { useCreateBuilding } from "@/hooks/buildings/useCreateBuilding";
import { useCreateMultipleRooms } from "@/hooks/rooms/useCreateRoom";

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

const ROOM_TYPES = [
  'TD',
  'COURS',
  'INFO',
  'AMPHITHEATRE'
];
export default function AddBuildingModal({ isOpen, onClose, onSuccess }: AddBuildingModalProps) {
  const { createRooms } = useCreateMultipleRooms();
  const { mutate: createBuilding } = useCreateBuilding();
  const [buildingName, setBuildingName] = useState('');
  const [rooms, setRooms] = useState<Array<Room>>([]);
  const [errors, setErrors] = useState<{ buildingName?: string; rooms?: string[] }>({});

  if (!isOpen) return null;
  const addRoom = () => {
    setRooms([...rooms, { number: '', capacity: '', type: 'TD' }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
    setErrors(prev => ({
      ...prev,
      rooms: prev.rooms?.filter((_, i) => i !== index)
    }));
  };

  const updateRoom = (index: number, field: keyof Room, value: string) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setRooms(newRooms);
  };

  const validate = () => {
    const newErrors: typeof errors = {};


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
      const validTypes = ['TD', 'COURS', 'INFO', 'AMPHITHEATRE'];

      const roomNumbers = rooms.map(r => r.number.trim().toLowerCase());

      newErrors.rooms = rooms.map((room) => {
        const number = room.number?.trim();
        const capacityRaw = room.capacity;
        const capacity = Number(capacityRaw);
        const type = room.type?.toUpperCase();


        if (!number) return "Numéro de salle obligatoire";

        if (!/^[A-Za-z0-9\- ]+$/.test(number)) return "Numéro invalide";


        if (roomNumbers.filter(n => n === number.toLowerCase()).length > 1) {
          return "Numéro de salle en double";
        }


        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (capacityRaw === "" || capacityRaw === null || capacityRaw === undefined) {
          return "Capacité obligatoire";
        }

        if (isNaN(capacity)) {
          return "Capacité invalide";
        }


        if (!Number.isInteger(capacity)) {
          return "Capacité doit être un entier";
        }


        if (capacity <= 0) {
          return "Capacité doit être supérieure à 0";
        }


        if (capacity > 1000) {
          return "Capacité maximale 1000";
        }


        if (!type) {
          return "Type obligatoire";
        }


        if (!validTypes.includes(type)) {
          return "Type invalide (TD, COURS, INFO, AMPHITHEATRE)";
        }

        return "";
      });


      if (newErrors.rooms.every(e => e === "")) {
        delete newErrors.rooms;
      }
    }

    setErrors(newErrors);

    return !newErrors.buildingName &&
      (!newErrors.rooms || newErrors.rooms.every(e => e === ""));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // créer le bâtiment
      createBuilding(buildingName, {
        onSuccess: async (createdBuilding) => {
          try {
            // Si aucune salle → OK ajout direct
            if (rooms.length === 0) {
              onSuccess?.(`Bâtiment "${buildingName}" ajouté avec succès !`);
              setBuildingName('');
              setRooms([]);
              onClose();
              return;
            }

            const roomsPayload = rooms.map(room => ({
              roomNumber: room.number.trim(),
              capacity: Number(room.capacity),
              isAvailable: true,
              buildingId: createdBuilding.id,
              type: room.type.toUpperCase() as "TD" | "COURS" | "INFO" | "AMPHITHEATRE"
            }));

            await createRooms(roomsPayload);

            onSuccess?.(`Bâtiment et salles ajoutés avec succès !`);
            setBuildingName('');
            setRooms([]);
            onClose();

          } catch (roomError: any) {
            console.error("Erreur rooms:", roomError);

            const apiError = roomError?.response?.data;

            let message = "Erreur lors de l'ajout des salles";

            if (apiError?.message) {
              message = apiError.message;
            }

            onSuccess?.(`Bâtiment créé, mais : ${message}`);

            setBuildingName('');
            setRooms([]);
            onClose();
          }
        },

        onError: (error: any) => {
          console.error("Erreur building:", error);

          const apiError = error?.response?.data;

          let message = "Erreur lors de la création du bâtiment";

          if (apiError?.message) {
            if (apiError.message === "Building already exists, choose another name") {
              message = "Ce bâtiment existe déjà, veuillez choisir un autre nom";
            } else {
              message = apiError.message;
            }
          }
          setErrors(prev => ({
            ...prev,
            buildingName: message
          }));
        }
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 relative">
        <button
          type="button"
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
              className={`input bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 w-full ${errors.buildingName ? 'ring-2 ring-red-500' : ''}`}
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