import { useState, useMemo } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import EditRoomModal from './EditRoomModal';
import DeleteRoomModal from './DeleteRoomModal';

interface Room {
    id: string;
    number: string;
    capacity: number;
    type: string;
}

interface RoomsTableProps {
    searchTerm: string;
    onSuccess: (message: string) => void;
}

export default function RoomsTable({ searchTerm, onSuccess }: RoomsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const rooms: Room[] = useMemo(() => [
        { id: '1', number: 'Salle 101', capacity: 30, type: 'TD' },
        { id: '2', number: 'Salle 205', capacity: 120, type: 'Amphi' },
        { id: '3', number: 'Salle 004', capacity: 25, type: 'TP' },
        { id: '4', number: 'Salle 110', capacity: 40, type: 'TD' },
    ], []);

    const filteredRooms = rooms.filter(room =>
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-gray-500 text-sm uppercase tracking-wider">
                            <th className="py-4 px-8 font-semibold">Numéro salle</th>
                            <th className="py-4 px-8 font-semibold">Capacité</th>
                            <th className="py-4 px-8 font-semibold">Type</th>
                            <th className="py-4 px-8 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                                    Aucune salle trouvée
                                </td>
                            </tr>
                        ) : currentData.map(room => (
                            <tr key={room.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="py-6 px-8 font-semibold text-gray-700">{room.number}</td>
                                <td className="py-6 px-8 text-gray-600 font-medium">{room.capacity} places</td>
                                <td className="py-6 px-8">
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">{room.type}</span>
                                </td>
                                <td className="py-6 px-8">
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => { setSelectedRoom(room); setIsEditModalOpen(true); }} className="p-2.5 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-500 transition-all">
                                            <HiOutlinePencil size={20} />
                                        </button>
                                        <button onClick={() => { setRoomToDelete(room); setIsDeleteModalOpen(true); }} className="p-2.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-all">
                                            <HiOutlineTrash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-5 bg-gray-50/30 border-t border-gray-50">
                        <div className="text-sm text-gray-500 font-medium">
                            Affichage de <span className="text-[#003366]">{startIndex + 1}</span> à <span className="text-[#003366]">{Math.min(startIndex + itemsPerPage, filteredRooms.length)}</span> sur {filteredRooms.length}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:bg-gray-50 shadow-sm">
                                <HiChevronLeft size={22} />
                            </button>
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:bg-gray-50 shadow-sm">
                                <HiChevronRight size={22} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <EditRoomModal isOpen={isEditModalOpen} room={selectedRoom} onClose={() => { setIsEditModalOpen(false); setSelectedRoom(null); }} onSuccess={onSuccess} />
            <DeleteRoomModal isOpen={isDeleteModalOpen} room={roomToDelete} onClose={() => { setIsDeleteModalOpen(false); setRoomToDelete(null); }} onSuccess={onSuccess} />
        </div>
    );
}
