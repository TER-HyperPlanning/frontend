import { useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import EditRoomModal from './EditRoomModal';
import DeleteRoomModal from './DeleteRoomModal';
import type { Room } from "@/hooks/api/rooms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'

interface RoomsTableProps {
    rooms: Array<Room>;
    searchTerm: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    filterType: string;
    existingRooms: Array<Room>;
}

export default function RoomsTable({ rooms, onSuccess, onError }: RoomsTableProps) {
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const filteredRooms = rooms;

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
                    ) : (
                        filteredRooms.map(room => (
                            <TableRow key={room.roomId}>
                                <TableCell className="font-medium text-base-content">
                                    {room.roomNumber}
                                </TableCell>

                                <TableCell className="text-sm">
                                    <span className="badge badge-ghost badge-sm font-medium">
                                        {room.capacity} places
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <span
                                        className={`badge badge-sm font-medium ${room.type === 'AMPHITHEATRE'
                                            ? 'badge-primary badge-outline'
                                            : room.type === 'TD'
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
                        ))
                    )}
                </TableBody>
            </Table>

            <EditRoomModal
                isOpen={isEditModalOpen}
                room={selectedRoom}
                onClose={() => { setIsEditModalOpen(false); setSelectedRoom(null); }}
                onSuccess={onSuccess} existingRooms={rooms} />

            <DeleteRoomModal
                isOpen={isDeleteModalOpen}
                room={roomToDelete}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setRoomToDelete(null);
                }}
                onSuccess={(msg) => onSuccess(msg)}
                onError={(msg) => onError(msg)}
            />
        </>
    );
}