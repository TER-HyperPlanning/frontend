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
  
    if (!isOpen) return null;
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      console.log("Nouvelle salle :", formData);
  
      onSuccess(`La salle ${formData.number} a été ajoutée avec succès !`);
  
      setFormData({ number: '', capacity: '', type: 'TD' });
      onClose();
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
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
  
          <h3 className="font-bold text-xl text-[#003366] mb-8">
            Ajouter une nouvelle salle
          </h3>
  
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
  
            <TextField
              label="Numéro de la salle"
              name="number"
              placeholder="Ex: Salle 101"
              value={formData.number}
              onChange={handleChange}
              required
              className="!bg-gray-50 !text-gray-900 placeholder:!text-gray-400 border-none focus:ring-2 focus:ring-blue-500"
            />
  
            <TextField
              label="Capacité (nombre de places)"
              name="capacity"
              type="number"
              placeholder="Ex: 30"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="!bg-gray-50 !text-gray-900 placeholder:!text-gray-400 border-none focus:ring-2 focus:ring-blue-500"
            />
  
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Type de salle
                </span>
              </label>
  
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="select bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 w-full h-12 rounded-xl text-gray-900"
              >
                {ROOM_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
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
  
        <div
          className="modal-backdrop bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      </div>
    );
  }
  