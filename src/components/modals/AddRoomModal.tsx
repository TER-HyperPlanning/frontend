import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import Button from '../Button';
import TextField from '../TextField';
import type { Room } from '@/hooks/api/rooms';
import { useCreateRoom } from '@/hooks/rooms/useCreateRoom';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  buildingId: string;
  existingRooms: Array<Room>;
}

const ROOM_TYPES = [
  { label: 'Salle de TD', value: 'TD' },
  { label: 'Salle de Cours', value: 'COURS' },
  { label: 'Informatique', value: 'INFO' },
  { label: 'Amphithéâtre', value: 'AMPHITHEATRE' }
];

export default function AddRoomModal({
  isOpen,
  onClose,
  onSuccess,
  buildingId,
  existingRooms
}: AddRoomModalProps) {

  const { mutate: createRoom, isPending } = useCreateRoom();

  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    type: 'TD'
  });

  const [errors, setErrors] = useState<{
    number?: string;
    capacity?: string;
    type?: string;
  }>({});


  const validate = () => {
    const newErrors: typeof errors = {};

    const roomNumber = formData.number.trim();
    const capacity = Number(formData.capacity);

    const roomNumberRegex = /^[a-zA-Z0-9\s-]+$/;


    if (!roomNumber) {
      newErrors.number = "Le numéro de la salle est obligatoire";
    }

    else if (!roomNumberRegex.test(roomNumber)) {
      newErrors.number = "Numéro invalide (lettres, chiffres, tiret uniquement)";
    }


    else if (
      existingRooms?.some(
        r =>
          r.roomNumber?.trim().toLowerCase() === roomNumber.toLowerCase()
      )
    ) {
      newErrors.number = "Cette salle existe déjà dans ce bâtiment";
    }

    if (!formData.capacity) {
      newErrors.capacity = "La capacité est obligatoire";
    }

    else if (!Number.isInteger(capacity)) {
      newErrors.capacity = "La capacité doit être un nombre entier";
    }
    else if (capacity <= 0) {
      newErrors.capacity = "La capacité doit être supérieure à 0";
    }
    else if (capacity > 1000) {
      newErrors.capacity = "Capacité trop élevée (max 1000)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    createRoom({
      roomNumber: formData.number.trim(),
      capacity: parseInt(formData.capacity, 10),
      isAvailable: true,
      buildingId,
      type: formData.type
    },
      {
        onSuccess: () => {
          onSuccess(`La salle ${formData.number} a été ajoutée avec succès !`);

          setFormData({
            number: '',
            capacity: '',
            type: 'TD'
          });

          setErrors({});
          onClose();
        },

        onError: (error: any) => {
          console.error("Erreur API:", error);

          const apiError = error?.response?.data;

          const serverMsg =
            apiError?.message ||
            apiError?.Message ||
            apiError?.error ||
            "Erreur serveur";

          onError(serverMsg);

          if (typeof serverMsg === "string" && serverMsg.includes("Invalid field values:")) {
            const fieldsPart = serverMsg.replace("Invalid field values:", "").trim();

            const fields = fieldsPart.split(",").map((f: string) => f.trim().toLowerCase());

            const newErrors: any = {};

            fields.forEach((field: string) => {
              if (field.includes("type")) {
                newErrors.type = "Type de salle invalide";
              }

              if (field.includes("capacity")) {
                newErrors.capacity = "Capacité invalide";
              }

              if (field.includes("roomnumber")) {
                newErrors.number = "Numéro invalide";
              }
            });

            setErrors(newErrors);
          } else {
            setErrors({
              number: serverMsg
            });
          }
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 relative">

        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400"
        >
          <HiX size={20} />
        </button>

        <h3 className="font-bold text-xl text-[#003366] mb-6">
          Nouvelle salle
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NUMBER */}
          <div className="flex flex-col">
            <TextField
              label="Numéro de la salle"
              name="number"
              placeholder="Ex: Salle 101"
              value={formData.number}
              onChange={handleChange}
              className="!bg-gray-50 !text-gray-900 border-none"
            />
            {errors.number && (
              <p className="text-red-500 text-xs mt-1">{errors.number}</p>
            )}
          </div>

          {/* CAPACITY */}
          <div className="flex flex-col">
            <TextField
              label="Capacité"
              name="capacity"
              type="number"
              placeholder="Ex: 30"
              value={formData.capacity}
              onChange={handleChange}
              className="!bg-gray-50 !text-gray-900 border-none"
            />
            {errors.capacity && (
              <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
            )}
          </div>

          {/* TYPE */}
          <div className="flex flex-col">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Type de salle
              </span>
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select bg-gray-50 border-none w-full h-12 rounded-xl"
            >
              {ROOM_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIONS */}
          <div className="modal-action flex gap-3 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 border rounded-xl"
            >
              Annuler
            </button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#003366] text-white flex-1 rounded-xl"
            >
              {isPending ? "Envoi..." : "Enregistrer"}
            </Button>

          </div>
        </form>
      </div>

      <div
        className="modal-backdrop bg-black/20"
        onClick={onClose}
      />
    </div>
  );
}