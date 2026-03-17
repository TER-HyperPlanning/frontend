import { useState } from 'react';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import { HiChevronDown } from 'react-icons/hi';

interface AddTeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onAdd: (teacher: any) => void;
}

export default function AddTeacherForm({
  isOpen,
  onClose,
  onSuccess,
  onAdd,
}: AddTeacherFormProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: '',
  });
  const [errors, setErrors] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    statut: '',
  });
  const [showStatutMenu, setShowStatutMenu] = useState(false);
  const statutOptions = ['Associé', 'Vacataire', 'Permanent'];

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let valid = true;
    const newErrors = { nom: '', prenom: '', email: '', telephone: '', statut: '' };

    if (!formData.nom.trim()) { newErrors.nom = 'Nom obligatoire'; valid = false; }
    if (!formData.prenom.trim()) { newErrors.prenom = 'Prénom obligatoire'; valid = false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { newErrors.email = 'Email invalide'; valid = false; }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.telephone)) { newErrors.telephone = 'Téléphone invalide (10 chiffres)'; valid = false; }

    if (!formData.statut) { newErrors.statut = 'Statut obligatoire'; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd(formData);
      onSuccess('Enseignant ajouté');
      onClose();
      setFormData({ nom: '', prenom: '', email: '', telephone: '', statut: '' });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-[#003366] mb-6 text-center">Ajouter un enseignant</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Nom */}
          <TextField
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="h-12 placeholder:text-gray-500 text-black"
          />
          {errors.nom && <span className="text-red-500 text-sm text-center">{errors.nom}</span>}

          {/* Prénom */}
          <TextField
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="h-12 placeholder:text-gray-500 text-black"
          />
          {errors.prenom && <span className="text-red-500 text-sm text-center">{errors.prenom}</span>}

          {/* Email */}
          <TextField
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 placeholder:text-gray-500 text-black"
          />
          {errors.email && <span className="text-red-500 text-sm text-center">{errors.email}</span>}

          {/* Téléphone */}
          <TextField
            name="telephone"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
            className="h-12 placeholder:text-gray-500 text-black"
          />
          {errors.telephone && <span className="text-red-500 text-sm text-center">{errors.telephone}</span>}

          {/* Statut */}
          <div className="relative w-49 ml-auto">
            <Button
                type="button"
                variant="light"
                rightIcon={<HiChevronDown />}
                className={`w-full justify-between items-center text-left ${errors.statut ? 'border-red-500' : ''}`}
                onClick={() => setShowStatutMenu((prev) => !prev)}
                >
                {formData.statut || 'Sélectionner un statut'}
            </Button>
            {showStatutMenu && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {statutOptions.map((s) => (
                  <div
                    key={s}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium text-center"
                    onClick={() => {
                      setFormData({ ...formData, statut: s });
                      setErrors({ ...errors, statut: '' });
                      setShowStatutMenu(false);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
            {errors.statut && <span className="text-red-500 text-sm text-center">{errors.statut}</span>}
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-4">
            <Button type="button" variant="light" onClick={onClose}>Annuler</Button>
            <Button type="submit" variant="filled" className="bg-[#003366] hover:bg-[#002244] text-white">
              Valider
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}