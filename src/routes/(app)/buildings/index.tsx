import { useState, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useBuildings } from "@/hooks/buildings/useBuildings";
import type { Building } from "@/hooks/api/buildings";
import { useEffect } from "react";
import Logo from '@/components/Logo';
import {
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCloudUpload,
  HiPlus,
  HiOutlineBell,
  HiChevronLeft,
  HiChevronRight,
  HiCheckCircle,
} from 'react-icons/hi';

import Button from '@/components/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import TextField from '@/components/TextField'; // Utilisation du composant existant
import PageLayout from '@/layout/PageLayout';
import AddBuildingModal from '@/components/modals/AddBuildingModal';
import EditBuildingModal from '@/components/modals/EditBuildingModal';
import DeleteBuildingModal from '@/components/modals/DeleteBuildingModal';

export const Route = createFileRoute('/(app)/buildings/')({
  component: BuildingsPage,
});

function BuildingsPage() {
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Augmenté pour mieux remplir l'espace

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  //l'appel du hooks  recuperation des données
  const { data: allBuildings = [], isLoading } = useBuildings();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-10 text-gray-500">Chargement...</div>
      </PageLayout>
    );
  }
  // --- LOGIQUE ---
  const filteredBuildings = allBuildings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBuildings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredBuildings.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <PageLayout>
      {/* Container avec Padding pour décoller du menu et des bords */}
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

        {/* HEADER : Recherche et Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full shrink-0">

          {/* Nouveau container pour Logo + Barre de recherche */}
          <div className="flex items-center gap-4 w-full lg:max-w-2xl">
            {/* Intégration du Logo */}
            <Logo showText={true} className="shrink-0 h-10 w-auto text-[#003366]" />

            {/* Barre de recherche */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 z-10">
                <HiOutlineSearch size={20} />
              </span>
              <TextField
                placeholder="Rechercher un bâtiment..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 w-full h-12 shadow-sm border-none bg-white text-gray-800 placeholder:text-gray-400"
                name="search"
              />
            </div>
          </div>

          {/* Actions (Import, Nouveau, Notifications) */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => console.log('Import CSV')}
              className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center p-3 rounded-xl shadow-sm"
              title="Importer CSV (format CSV uniquement)"
            >
              <HiOutlineCloudUpload size={20} />
            </button>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#003366] hover:bg-[#002244] text-white flex items-center gap-2 px-8 h-12 flex-1 lg:flex-none rounded-xl transition-all shadow-md"
            >
              <HiPlus size={20} />
              <span className="whitespace-nowrap font-semibold">Nouveau bâtiment</span>
            </Button>

            <button
              className="btn btn-ghost btn-circle bg-white shadow-sm shrink-0 h-12 w-12 border border-gray-100"
              title="Notifications"
            >
              <HiOutlineBell size={24} className="text-gray-600" />
            </button>
          </div>
        </div>
        {/* CONTENU : Scrollable avec espacement */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          {/* TABLEAU */}
          <div className="card bg-base-100 border border-base-200">
            <div className="overflow-x-auto">
              <Table>

                {/* HEADER */}
                <TableHead>
                  <TableRow>
                    <TableHeader>
                      Liste des Bâtiments
                    </TableHeader>

                    <TableHeader className="text-right">
                      Actions
                    </TableHeader>
                  </TableRow>
                </TableHead>

                {/* BODY */}
                <TableBody>

                  {currentData.length > 0 ? (
                    currentData.map((building) => (
                      <TableRow key={building.id}>
                        <TableCell className="font-medium text-base-content">
                          {building.name}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                navigate({ to: `/buildings/${building.id}` })
                              }
                              className="btn btn-ghost btn-sm text-base-content/50 hover:text-primary"
                              data-tip="Détails du bâtiment"
                            >
                              <HiOutlineSearch size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedBuilding(building);
                                setIsEditModalOpen(true);
                              }}
                              className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                              data-tip="Modifier bâtiment"
                            >
                              <HiOutlinePencil size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedBuilding(building);
                                setIsDeleteModalOpen(true);
                              }}
                              className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                              data-tip="Supprimer bâtiment"
                            >
                              <HiOutlineTrash size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-16 text-base-content/50">
                        Aucun bâtiment trouvé
                      </TableCell>
                    </TableRow>
                  )}

                </TableBody>
              </Table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-8 py-5 bg-gray-50/30 border-t border-gray-50">
                <div className="text-sm text-gray-500 font-medium">
                  Affichage de <span className="text-[#003366]">{startIndex + 1}</span> à <span className="text-[#003366]">{Math.min(startIndex + itemsPerPage, filteredBuildings.length)}</span> sur {filteredBuildings.length}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:bg-gray-50 shadow-sm transition-all"
                  >
                    <HiChevronLeft size={22} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:bg-gray-50 shadow-sm transition-all"
                  >
                    <HiChevronRight size={22} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODALS */}
        <EditBuildingModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedBuilding(null); }}
          building={selectedBuilding}
          onSuccess={showSuccess}
        />

        <DeleteBuildingModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setSelectedBuilding(null); }}
          building={selectedBuilding}
          onSuccess={showSuccess}
        />
        <AddBuildingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={showSuccess}
        />
      </div>
    </PageLayout>
  );
}