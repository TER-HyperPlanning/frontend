import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import Button from '../Button';
import type { Room, RoomRequest } from "@/hooks/api/rooms";
import type { AxiosError } from 'axios';
import { useUpdateRoom } from "@/hooks/rooms/useUpdateRoom";

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onSuccess: (message: string) => void;
  existingRooms: Array<Room>;
}


const ROOM_TYPES = [
  { label: 'Salle de TD', value: 'TD' },
  { label: 'Salle de cours', value: 'COURS' },
  { label: 'Salle informatique', value: 'INFO' },
  { label: 'Amphithéâtre', value: 'AMPHITHEATRE' }
];


export default function EditRoomModal({
  isOpen,
  onClose,
  room,
  onSuccess,
  existingRooms
}: EditRoomModalProps) {

  const { mutate: updateRoom, isPending } = useUpdateRoom();

  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState<number>(0);
  const [type, setType] =
    useState<'TD' | 'COURS' | 'INFO' | 'AMPHITHEATRE'>('TD');

  const [error, setError] = useState('');

  useEffect(() => {
    if (room && isOpen) {
      setRoomNumber(room.roomNumber || '');
      setCapacity(room.capacity || 0);
      setType(room.type?.toUpperCase() as any);
      setError('');
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const validate = () => {
    const roomNumberTrim = roomNumber.trim();
    const roomNumberRegex = /^[a-zA-Z0-9\s-]+$/;

    if (!roomNumberTrim) {
      setError("Le numéro de salle est obligatoire");
      return false;
    }

    if (!roomNumberRegex.test(roomNumberTrim)) {
      setError("Numéro invalide (lettres, chiffres, tiret uniquement)");
      return false;
    }

    const exists = existingRooms?.some(
      (r) =>
        r.roomNumber.toLowerCase() === roomNumberTrim.toLowerCase() &&
        r.roomId !== room?.roomId
    );

    if (exists) {
      setError("Ce numéro de salle existe déjà dans ce bâtiment");
      return false;
    }

    if (capacity <= 0) {
      setError("La capacité doit être supérieure à 0");
      return false;
    }

    if (capacity > 1000) {
      setError("Capacité trop élevée (max 1000)");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload: RoomRequest = {
      roomId: room.roomId,
      roomNumber: roomNumber.trim(),
      capacity: Number(capacity),
      isAvailable: room.isAvailable ?? true,
      buildingId: room.buildingId,
      type: type.trim().toUpperCase() as "TD" | "COURS" | "INFO" | "AMPHITHEATRE"
    };

    updateRoom(
      { id: room.roomId, data: payload },
      {
        onSuccess: () => {
          onClose();
          onSuccess(`La salle "${roomNumber}" a été mise à jour avec succès`);
        },
        onError: (err: any) => {
          const data = err?.response?.data;

          const rawMessage =
            data?.message ||
            data?.error ||
            data?.title ||
            err?.message ||
            "Erreur serveur";

          let message = rawMessage;

          const lower = rawMessage.toLowerCase();

          if (err?.response?.status === 404) {
            message = "Cette salle n'existe plus";
            onClose();
          }

          else if (err?.response?.status === 409) {
            message = rawMessage || "Conflit : salle déjà utilisée";
          }

          else if (err?.response?.status === 400) {
            message = rawMessage;
          }

          else if (lower.includes("duplicate") || lower.includes("unique")) {
            message = "Ce numéro de salle existe déjà";
          }

          else if (lower.includes("invalid")) {
            message = rawMessage;
          }

          setError(message);
        }
      }
    );
  };


  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white rounded-2xl p-0 overflow-hidden shadow-2xl border border-gray-100">

        {/* HEADER */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-xl text-[#003366]">
            Modifier la salle
          </h3>

          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-gray-400"
          >
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

          <div className="form-control w-full">
            <label className="label text-xs font-bold text-gray-500 uppercase">
              Numéro de salle
            </label>

            <input
              type="text"
              className="input bg-gray-50 border-none w-full text-[#003366] font-medium h-12"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>

          {/* CAPACITY + TYPE */}
          <div className="flex gap-4">

            <div className="form-control flex-1">
              <label className="label text-xs font-bold text-gray-500 uppercase">
                Capacité
              </label>

              <input
                type="number"
                className="input bg-gray-50 border-none w-full h-12"
                value={capacity}
                onChange={(e) =>
                  setCapacity(parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div className="form-control flex-1">
              <label className="label text-xs font-bold text-gray-500 uppercase">
                Type
              </label>

              <select
                className="select bg-gray-50 border-none w-full h-12"
                value={type}
                onChange={(e) => {
                  const value = e.target.value.trim().toUpperCase();

                  const allowed = ["TD", "COURS", "INFO", "AMPHITHEATRE"];

                  if (allowed.includes(value)) {
                    setType(value as any);
                  }
                }}
              >
                {ROOM_TYPES.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <span className="text-red-500 text-xs font-semibold">
              {error}
            </span>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 border border-gray-200 rounded-xl"
            >
              Annuler
            </button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#003366] text-white flex-1 h-12 rounded-xl"
            >
              {isPending ? "En cours..." : "Enregistrer"}
            </Button>

          </div>
        </form>
      </div>

      {/* BACKDROP */}
      <div
        className="modal-backdrop bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
}