import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { HiPlus, HiCheckCircle, HiOutlineOfficeBuilding, HiOutlineSearch, HiOutlineBell, HiChevronLeft } from 'react-icons/hi';

import PageLayout from '@/layout/PageLayout';
import Button from '@/components/Button';
import TextField from '@/components/TextField';
import RoomsTable from '@/components/modals/RoomsTable';
import AddRoomModal from '@/components/modals/AddRoomModal';

export const Route = createFileRoute('/(app)/buildings/$buildingId')({
  component: BuildingDetailsPage,
});

export default function BuildingDetailsPage() {
  
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  // Exemple : nom dynamique à récupérer via API si besoin
  const buildingName = "Bâtiment IBGBI";

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-8 p-6 lg:p-10 h-full w-full relative overflow-hidden">

        {/* TOAST DE SUCCÈS */}
        {successMessage && (
          <div className="toast toast-top toast-end z-[100] mt-4 mr-4">
            <div className="alert alert-success shadow-lg text-white border-none bg-emerald-500 flex items-center gap-2">
              <HiCheckCircle size={22} />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full shrink-0">
          <div className="relative w-full lg:max-w-xl">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 z-10">
              <HiOutlineSearch size={20} />
            </span>
            <TextField
              placeholder="Rechercher une salle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 w-full h-12 shadow-sm border-none bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/20"
              name="searchRoom"
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Button
              onClick={() => setIsAddRoomModalOpen(true)}
              className="bg-[#003366] hover:bg-[#002244] text-white flex items-center gap-2 px-8 h-12 flex-1 lg:flex-none rounded-xl transition-all shadow-md"
            >
              <HiPlus size={20} />
              <span className="whitespace-nowrap font-semibold">Ajouter une salle</span>
            </Button>

            <button className="btn btn-ghost btn-circle bg-white shadow-sm h-12 w-12 border border-gray-100">
              <HiOutlineBell size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={() => navigate({ to: '/buildings' })}
            className="flex items-center gap-2 text-gray-400 hover:text-[#003366] transition-colors text-sm font-medium w-fit"
          >
            <HiChevronLeft size={20} />
            Retour aux bâtiments
          </button>
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2 bg-blue-50 text-[#003366] rounded-lg">
              <HiOutlineOfficeBuilding size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[#003366] uppercase tracking-tight">
              {buildingName}
            </h1>
          </div>
        </div>

        {/* TABLE DES SALLES */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="card bg-base-100 border border-base-200">
            <div className="overflow-x-auto">
              <RoomsTable
                searchTerm={searchTerm}
                onSuccess={showSuccess}
              />
            </div>
          </div>
        </div>

        {/* MODAL AJOUT */}
        <AddRoomModal
          isOpen={isAddRoomModalOpen}
          onClose={() => setIsAddRoomModalOpen(false)}
          onSuccess={showSuccess}
        />
      </div>
    </PageLayout>
  );
}
