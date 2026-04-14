import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import type { Teacher } from './types';

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  teacher: Teacher | null;
  onEdit: (updatedTeacher: Teacher) => void;
}

const statutOptions = ["Associé", "Vacataire", "Permanent"];

export default function EditTeacherModal({
  isOpen,
  onClose,
  onSuccess,
  teacher,
  onEdit,
}: EditTeacherModalProps) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [statut, setStatut] = useState("");
  const [showStatutMenu, setShowStatutMenu] = useState(false);

  // Pré-remplir les champs quand le modal s'ouvre
  const [errors, setErrors] = useState<{
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    statut?: string;
  }>({});

  useEffect(() => {
    if (teacher) {
      setNom(teacher.nom);
      setPrenom(teacher.prenom);
      setEmail(teacher.email);
      setTelephone(teacher.telephone);
      setStatut(teacher.statut);
      setErrors({});
    }
  }, [teacher]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!nom) newErrors.nom = "Nom obligatoire";
    if (!prenom) newErrors.prenom = "Prénom obligatoire";

    if (!email) newErrors.email = "Email obligatoire";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email invalide";

    if (!telephone) newErrors.telephone = "Téléphone obligatoire";
    else if (!/^\d{10}$/.test(telephone)) newErrors.telephone = "Téléphone doit avoir 10 chiffres";

    if (!statut) newErrors.statut = "Statut obligatoire";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!teacher) return;
    if (!validate()) return;

    onEdit({
      ...teacher,
      nom,
      prenom,
      email,
      telephone,
      statut,
    });

    onSuccess("Vos modifications ont été enregistrées");
    onClose();
  };

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <HiX size={24} />
        </button>

        <h2 className="text-xl font-semibold text-center text-[#003366]">
          Modifier {teacher.nom} {teacher.prenom}
        </h2>

        {/* Nom */}
        <TextField
          name="nom"
          placeholder={teacher.nom}
          value={nom}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNom(e.target.value)
          }
          error={errors.nom}
          className="h-12 placeholder:text-gray-600 text-gray-800"
        />

        {/* Prénom */}
        <TextField
          name="prenom"
          placeholder={teacher.prenom}
          value={prenom}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrenom(e.target.value)
          }
          error={errors.prenom}
          className="h-12 placeholder:text-gray-600 text-gray-800"
        />

        {/* Email */}
        <TextField
          name="email"
          placeholder={teacher.email}
          value={email}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          error={errors.email}
          className="h-12 placeholder:text-gray-600 text-gray-800"
        />

        {/* Téléphone */}
        <TextField
          name="telephone"
          placeholder={teacher.telephone}
          value={telephone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setTelephone(e.target.value)}
          error={errors.telephone}
          className="h-12 placeholder:text-gray-600 text-gray-800"
        />

        {/* Statut */}
        <div className="relative">
          <Button
            variant="light"
            rightIcon={<span className="text-gray-600">▼</span>}
            onClick={() => setShowStatutMenu((prev) => !prev)}
            className="w-full justify-between h-10 px-4 text-gray-800 text-sm"
          >
            {statut || "Sélectionner un statut"}
          </Button>
          {showStatutMenu && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {statutOptions.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                  onClick={() => {
                    setStatut(option);
                    setShowStatutMenu(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
          {errors.statut && <p className="text-red-500 text-xs mt-1">{errors.statut}</p>}
        </div>

        {/* Boutons */}
        <div className="flex justify-between mt-4">
          <Button variant="light" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="filled" onClick={handleSubmit}>
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
}