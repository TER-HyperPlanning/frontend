import { useState, useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'
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

    const getRoomTypeBadge = (type: string) => {
        switch (type) {
            case 'Amphi':
                return BADGE_STYLES['info-outline']
            case 'TP':
                return BADGE_STYLES['secondary-outline']
            default:
                return BADGE_STYLES['active-outline']
        }
    }

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Numéro salle</TableHeader>
                        <TableHeader>Capacité</TableHeader>
                        <TableHeader>Type</TableHeader>
                        <TableHeader className="text-right">Actions</TableHeader>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filteredRooms.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="px-4 py-0">
                                <EmptyState 
                                    title="Aucune salle trouvée"
                                    message={searchTerm ? "Aucune salle ne correspond à votre recherche" : "Aucune salle enregistrée pour le moment"}
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredRooms.map(room => (
                            <TableRow key={room.id}>
                                <TableCell className="font-semibold text-gray-900">
                                    {room.number}
                                </TableCell>

                                <TableCell>
                                    <span className={BADGE_STYLES['active-outline']}>
                                        {room.capacity} places
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <span className={getRoomTypeBadge(room.type)}>
                                        {room.type}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setIsEditModalOpen(true);
                                            }}
                                            className={ACTION_BUTTON_STYLES.edit}
                                            title="Modifier"
                                            aria-label="Modifier salle"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setRoomToDelete(room);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className={ACTION_BUTTON_STYLES.delete}
                                            title="Supprimer"
                                            aria-label="Supprimer salle"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <EditRoomModal isOpen={isEditModalOpen} room={selectedRoom} onClose={() => { setIsEditModalOpen(false); setSelectedRoom(null); }} onSuccess={onSuccess} />
            <DeleteRoomModal isOpen={isDeleteModalOpen} room={roomToDelete} onClose={() => { setIsDeleteModalOpen(false); setRoomToDelete(null); }} onSuccess={onSuccess} />
        </>
    );
}
