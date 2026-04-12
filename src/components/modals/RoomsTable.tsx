import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'

import EditRoomModal from './EditRoomModal'
import DeleteRoomModal from './DeleteRoomModal'
import type { Room } from "@/hooks/api/rooms"

interface RoomsTableProps {
  rooms: Array<Room>
  searchTerm: string
  onSuccess: (message: string) => void
  onError: (message: string) => void
  existingRooms: Array<Room>
}

export default function RoomsTable({
  rooms,
  searchTerm,
  onSuccess,
  onError,
}: RoomsTableProps) {
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const filteredRooms = rooms.filter(room =>
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                  message={
                    searchTerm
                      ? "Aucune salle ne correspond à votre recherche"
                      : "Aucune salle enregistrée pour le moment"
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            filteredRooms.map(room => (
              <TableRow key={room.id}>
                <TableCell className="font-semibold text-base-content">
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
                    
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedRoom(room)
                        setIsEditModalOpen(true)
                      }}
                      className={ACTION_BUTTON_STYLES.edit}
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setRoomToDelete(room)
                        setIsDeleteModalOpen(true)
                      }}
                      className={ACTION_BUTTON_STYLES.delete}
                      title="Supprimer"
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

      <EditRoomModal
        isOpen={isEditModalOpen}
        room={selectedRoom}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedRoom(null)
        }}
        onSuccess={onSuccess}
        existingRooms={rooms}
      />

      <DeleteRoomModal
        isOpen={isDeleteModalOpen}
        room={roomToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setRoomToDelete(null)
        }}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  )
}