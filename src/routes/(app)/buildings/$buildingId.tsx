import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  HiCheckCircle,
  HiChevronLeft,
  HiOutlineExclamation,
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiPlus
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useRooms } from "@/hooks/rooms/useRooms";
import { useBuildings } from "@/hooks/buildings/useBuildings";
import Logo from '@/components/Logo';

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
  const { buildingId } = Route.useParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  // 1. Récupérer toutes les salles (Données réelles de l'API)
  const { data: allRooms = [], isLoading: roomsLoading } = useRooms();

  // 2. Récupérer les infos du bâtiment pour le titre
  const { data: buildings = [] } = useBuildings();
  const currentBuilding = buildings.find(b => b.id === buildingId);

  // 3. Filtrer les salles par BuildingId provenant de l'URL
  const buildingRooms = allRooms.filter((r) => r.buildingId === buildingId);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleError = (msg: string) => {
    showError(msg);
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (roomsLoading) return <PageLayout><div className="p-10">Chargement des salles...</div></PageLayout>;

  return (
    <PageLayout>
      <div className="flex flex-col gap-8 p-6 lg:p-10 h-full w-full relative overflow-hidden">
        {/* TOAST */}
        {successMessage && (
          <div className="toast toast-top toast-end z-[100] mt-4 mr-4">
            <div className="alert alert-success shadow-lg text-white bg-emerald-500 flex items-center gap-2">
              <HiCheckCircle size={22} />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="toast toast-top toast-end z-[100] mt-4 mr-4">
            <div className="alert alert-error shadow-lg text-white bg-red-500 flex items-center gap-2">
              <HiOutlineExclamation size={22} />
              <span className="font-medium">{errorMessage}</span>
            </div>
          </div>
        )}


        {/* HEADER ACTIONS */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full shrink-0">

          <div className="flex items-center gap-4 w-full lg:max-w-2xl">

            <Logo showText={true} className="shrink-0 h-10 w-auto text-[#003366]" />

            {/* SEARCH IDENTIQUE BUILDINGS */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 z-10">
                <HiOutlineSearch size={20} />
              </span>

              <TextField
                placeholder="Rechercher une salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full h-12 shadow-sm border-none bg-white text-gray-800 placeholder:text-gray-400"
                name="searchRoom"
              />
            </div>
          </div>

          {/* RIGHT: BUTTON (reste bien à droite) */}
          <div className="flex items-center gap-4 w-full lg:w-auto">

            <Button
              onClick={() => setIsAddRoomModalOpen(true)}
              className="bg-[#003366] text-white flex items-center gap-2 px-8 h-12 rounded-xl shadow-md"
            >
              <HiPlus size={20} />
              <span>Ajouter une salle</span>
            </Button>

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
              {currentBuilding?.name || "Chargement..."}
              <span className="ml-2 text-gray-400 font-normal text-lg">({buildingRooms.length} salles)</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="card bg-base-100 border border-base-200">
            <RoomsTable
              rooms={buildingRooms}
              searchTerm={searchTerm}
              onSuccess={showSuccess}
              onError={handleError}
              existingRooms={[]} />
          </div>
        </div>

        <AddRoomModal
          isOpen={isAddRoomModalOpen}
          onClose={() => setIsAddRoomModalOpen(false)}
          onSuccess={showSuccess}
          onError={handleError} 
          buildingId={buildingId}
          existingRooms={buildingRooms}
        />
      </div>
    </PageLayout>
  );
}