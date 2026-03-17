import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import Button from '../Button';
import TextField from '../TextField';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const ROOM_TYPES = ['TD', 'TP', 'Amphi', 'Labo', 'Info'];

export default function AddRoomModal({ isOpen, onClose, onSuccess }: AddRoomModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    type: 'TD'
  });

  const [errors, setErrors] = useState<{ number?: string; capacity?: string; type?: string }>({});

  // Valide les champs
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.number.trim()) newErrors.number = "Le numéro de la salle est obligatoire";
    if (!/^[A-Za-z0-9\- ]+$/.test(formData.number))
      newErrors.number = "Le numéro contient des caractères invalides";
    if (!formData.capacity || Number(formData.capacity) <= 0)
      newErrors.capacity = "La capacité doit être supérieure à 0";
    if (!ROOM_TYPES.includes(formData.type))
      newErrors.type = "Type de salle invalide";
   
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return; // si erreurs → on ne ferme pas le modal

    // Si tout est valide → toast + reset + fermer
    onSuccess(`La salle ${formData.number} a été ajoutée avec succès !`);
    setFormData({ number: '', capacity: '', type: 'TD' });
    setErrors({});
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 relative">

        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400"
        >
          <HiX size={20} />
        </button>

        <h3 className="font-bold text-xl text-[#003366] mb-6">Nouvelle salle</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col">
            <TextField
              label="Numéro de la salle"
              name="number"
              placeholder="Ex: Salle 101"
              value={formData.number}
              onChange={handleChange}
              className="!bg-gray-50 !text-gray-900 placeholder:!text-gray-400 border-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
          </div>

          <div className="flex flex-col">
            <TextField
              label="Capacité (nombre de places)"
              name="capacity"
              type="number"
              placeholder="Ex: 30"
              value={formData.capacity}
              onChange={handleChange}
              className="!bg-gray-50 !text-gray-900 placeholder:!text-gray-400 border-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
          </div>

          <div className="flex flex-col">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Type de salle</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 w-full h-12 rounded-xl text-gray-900"
            >
              {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <div className="modal-action flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-gray-500 flex-1 border border-gray-200 rounded-xl"
            >
              Annuler
            </button>

            <Button
              type="submit"
              className="bg-[#003366] hover:bg-[#002244] text-white flex-1 rounded-xl shadow-md"
            >
              Enregistrer
            </Button>
          </div>

        </form>
      </div>

      <div className="modal-backdrop bg-black/20 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
}