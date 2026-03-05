import { useState, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- DONNÉES ---
  const allBuildings = useMemo(() => [
    { id: 1, name: 'Bâtiments IBGBI' },
    { id: 2, name: 'Bâtiments Île de France' },
    { id: 3, name: 'Bâtiments A' },
    { id: 4, name: 'Bâtiments B' },
    { id: 5, name: 'Bâtiments C' },
    { id: 6, name: 'Bâtiments D' },
    { id: 7, name: 'Bâtiments E' },
    { id: 8, name: 'Bâtiments F' },
    { id: 9, name: 'Bâtiments G' },
  ], []);

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
          <div className="relative w-full lg:max-w-xl">
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

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#003366] hover:bg-[#002244] text-white flex items-center gap-2 px-8 h-12 flex-1 lg:flex-none rounded-xl transition-all shadow-md"
            >
              <HiPlus size={20} />
              <span className="whitespace-nowrap font-semibold">Nouveau bâtiment</span>
            </Button>

            <button className="btn btn-ghost btn-circle bg-white shadow-sm shrink-0 h-12 w-12 border border-gray-100">
              <HiOutlineBell size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* CONTENU : Scrollable avec espacement */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">

          {/* ZONE IMPORT CSV */}
          <div className="flex">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-8 w-64 text-center cursor-pointer hover:bg-blue-50 transition-all group shadow-sm">
              <div className="p-3 bg-white rounded-full shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                <HiOutlineCloudUpload size={32} />
              </div>
              <p className="text-sm text-blue-900 font-semibold mt-4 leading-tight">
                Importer des données <br />
                <span className="text-xs font-normal text-blue-400">Format CSV uniquement</span>
              </p>
            </div>
          </div>

          {/* TABLEAU */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-gray-400 text-[12px] uppercase tracking-[0.1em] border-b border-gray-50">
                    <th className="font-bold py-6 px-8 text-left">Liste des Bâtiments</th>
                    <th className="font-bold py-6 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentData.length > 0 ? (
                    currentData.map((building) => (
                      <tr key={building.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="py-6 px-8">
                          <span className="font-bold text-[#003366] text-lg uppercase tracking-tight">
                            {building.name}
                          </span>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate({ to: `/buildings/${building.id}` })}
                              className="p-2.5 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all"
                              title="Voir détails"
                            >
                              <HiOutlineSearch size={20} />
                            </button>
                            <button
                              onClick={() => { setSelectedBuilding(building); setIsEditModalOpen(true); }}
                              className="p-2.5 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-500 transition-all"
                              title="Modifier"
                            >
                              <HiOutlinePencil size={20} />
                            </button>
                            <button
                              onClick={() => { setSelectedBuilding(building); setIsDeleteModalOpen(true); }}
                              className="p-2.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-all"
                              title="Supprimer"
                            >
                              <HiOutlineTrash size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-16 text-center">
                        <p className="text-gray-400 font-medium">Aucun bâtiment ne correspond à votre recherche.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        <AddBuildingModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
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
      </div>
    </PageLayout>
  );
}