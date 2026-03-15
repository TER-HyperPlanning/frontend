import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import Button from '../Button';

interface Room {
  id: string;
  number: string;
  capacity: number;
  type: string;
}

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onSuccess: (message: string) => void;
}

export default function EditRoomModal({ isOpen, onClose, room, onSuccess }: EditRoomModalProps) {
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState<number>(0);
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (room && isOpen) {
      setRoomNumber(room.number);
      setCapacity(room.capacity);
      setType(room.type);
      setError('');
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomNumber.trim().length < 2) {
      setError('Le numéro de salle est requis.');
      return;
    }
    if (!/^[A-Za-z0-9\- ]+$/.test(roomNumber)) {
      setError("Le numéro contient des caractères invalides");
      return;
      onSuccess(`La salle "${roomNumber}" a été mise à jour !`);
      onClose();
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white rounded-2xl p-0 overflow-hidden shadow-2xl border border-gray-100">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-xl text-[#003366]">Modifier la salle</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-gray-400"><HiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="form-control w-full">
            <label className="label text-xs font-bold text-gray-500 uppercase">Numéro de salle</label>
            <input
              type="text"
              className="input bg-gray-50 border-none w-full text-[#003366] font-medium h-12"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="form-control flex-1">
              <label className="label text-xs font-bold text-gray-500 uppercase">Capacité</label>
              <input
                type="number"
                className="input bg-gray-50 border-none w-full h-12"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="form-control flex-1">
              <label className="label text-xs font-bold text-gray-500 uppercase">Type</label>
              <select
                className="select bg-gray-50 border-none w-full h-12"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="TD">TD</option>
                <option value="TP">TP</option>
                <option value="Amphi">Amphi</option>
              </select>
            </div>
          </div>

          {error && <span className="text-red-500 text-xs font-semibold">{error}</span>}

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1 border border-gray-200 rounded-xl">Annuler</button>
            <Button type="submit" className="bg-[#003366] text-white flex-1 h-12 rounded-xl">Enregistrer</Button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
}