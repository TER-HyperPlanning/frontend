import { useState, useMemo } from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
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

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Numéro salle</TableHeader>
                        <TableHeader>Capacité</TableHeader>
                        <TableHeader>Type</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filteredRooms.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="py-16 text-center text-base-content/50">
                                Aucune salle trouvée
                            </TableCell>
                        </TableRow>
                    ) : filteredRooms.map(room => (
                        <TableRow key={room.id}>
                            <TableCell className="font-medium text-base-content">
                                {room.number}
                            </TableCell>

                            <TableCell className="text-sm">
                                <span className="badge badge-ghost badge-sm font-medium">
                                    {room.capacity} places
                                </span>
                            </TableCell>

                            <TableCell>
                                <span
                                    className={`badge badge-sm font-medium ${
                                        room.type === 'Amphi'
                                            ? 'badge-primary badge-outline'
                                            : room.type === 'TP'
                                                ? 'badge-secondary badge-outline'
                                                : 'badge-accent badge-outline'
                                    }`}
                                >
                                    {room.type}
                                </span>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                                    >
                                        <HiOutlinePencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setRoomToDelete(room);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                                    >
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <EditRoomModal isOpen={isEditModalOpen} room={selectedRoom} onClose={() => { setIsEditModalOpen(false); setSelectedRoom(null); }} onSuccess={onSuccess} />
            <DeleteRoomModal isOpen={isDeleteModalOpen} room={roomToDelete} onClose={() => { setIsDeleteModalOpen(false); setRoomToDelete(null); }} onSuccess={onSuccess} />
        </>
    );
}
