import {
  X,
  User,
  GraduationCap,
  Clock,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  Users,
  School,
  XCircle, CalendarDays, Check 
} from 'lucide-react'

import { useState, useMemo, useEffect  } from 'react'
import type { SessionChange } from '../../types/sessionChange'

import { useRoom } from '@/hooks/requests/useRoomQuery'
import { useSessionChange } from '@/hooks/requests/useSessionChangesById'
import { useSessionGroups } from '@/hooks/requests/useSessionGroups'
import { useSessionChangeService } from '@/services/requestservices'
import { useTrack } from '@/hooks/requests/useTrackFromGroup'
import { useProgram } from '@/hooks/requests/useProgramFromTrack'
import { useQueries } from '@tanstack/react-query'
import { useBuilding } from '@/hooks/requests/useBuilding'
import { useAvailableRooms } from '@/hooks/requests/useAvailableRooms'
import {useApproveRoom} from '@/hooks/requests/useApproveRoom'
import AlternativeSlotModal from './AlternativeSlotModal'
import ConfirmModal from './ConfirmModal'
import RejectReasonModal from './RejectReasonModal'
import { useRejectSessionChange } from '@/hooks/requests/useReject'


interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: SessionChange
  setToast: (toast: { message: string; type: 'success' | 'error' }) => void
}
interface AvailableRoom {
  roomId: string
  roomNumber: string
  buildingName: string
  capacity: number
  type: string
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const formatTime = (time: any) => {
  if (!time) return ''
  return typeof time === 'string' ? time.slice(0, 5) : ''
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'En attente':
      return 'En attente'
    case 'Approuvé':
      return 'Approuvé'
    case 'Refusé':
      return 'Refusé'
    default:
      return status
  }
}

export default function RequestDetailsModal({
  isOpen,
  onClose,
  request,
  setToast,
}: RequestDetailsModalProps) {
  const { mutate: approveRoom } = useApproveRoom()
  const { mutate: rejectSessionChange } = useRejectSessionChange()

  const { data: session } = useSessionChange(request.id)

  const sessionId = session?.sessionId
  const roomId = session?.currentRoomId

  const { data: room } = useRoom(roomId)
  const oldRoomId = session?.oldRoomId
  const { data: oldRoom } = useRoom(oldRoomId)

  const { data: attends } = useSessionGroups(sessionId)
  
  useEffect(() => {
  const savedToast = localStorage.getItem('toast')

  if (savedToast) {
    setToast(JSON.parse(savedToast))
    localStorage.removeItem('toast')
  }
}, [])

  const { getGroup } = useSessionChangeService()
  const oldBuildingId = oldRoom?.buildingId
  const { data: oldBuilding } = useBuilding(oldBuildingId)

  const groupQueries = useQueries({
    queries: (attends ?? []).map((a: any) => ({
      queryKey: ['group', a.groupId],
      queryFn: () => getGroup(a.groupId),
      enabled: !!a.groupId,
    })),
  })

  const groupResults = useMemo<any[]>(
    () => groupQueries.map(q => q.data).filter(Boolean),
    [groupQueries]
  )

  const groupNames = groupResults
    .map((g: any) => g?.name)
    .filter(Boolean)

  const trackId = groupResults?.[0]?.trackId
  const { data: track } = useTrack(trackId ?? undefined)

  const programId = track?.programId
  const { data: program } = useProgram(programId ?? undefined)

  const proposedRoomId = session?.proposedRoomId
  const { data: proposedRoom } = useRoom(proposedRoomId)

  const proposedBuildingId = proposedRoom?.buildingId
  const { data: proposedBuilding } = useBuilding(proposedBuildingId)

  const counterRoomId = session?.counterProposalRoomId
  const { data: counterRoom } = useRoom(counterRoomId)

  const counterBuildingId = counterRoom?.buildingId
  const { data: counterBuilding } = useBuilding(counterBuildingId)
  const { data: availableRoomsData, isLoading } = useAvailableRooms(sessionId)
  
  const [showConfirmAccept, setShowConfirmAccept] = useState(false)
  const [showAlternativeModal, setShowAlternativeModal] = useState(false)
  const [showConfirmAlternative, setShowConfirmAlternative] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null)
  const [roomSearch, setRoomSearch] = useState('')
  const [showConfirmRoom, setShowConfirmRoom] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)


  const { getRoom } = useSessionChangeService()
  const roomDetailsQueries = useQueries({
    queries: (availableRoomsData ?? []).map((r: any) => ({
      queryKey: ['room-details', r.roomId],
      queryFn: () => getRoom(r.roomId),
      enabled: !!r.roomId,
    })),
  })

  const roomsWithTypes = (availableRoomsData ?? []).map((room: any, index: number) => {
    const details = roomDetailsQueries[index]?.data as AvailableRoom | undefined

    return {
      ...room,
      type: details?.type ?? 'Inconnu',
    }
  })

 
  const filteredRooms = roomsWithTypes.filter((room: any) =>
    room.roomNumber.toLowerCase().includes(roomSearch.toLowerCase()) ||
    room.buildingName.toLowerCase().includes(roomSearch.toLowerCase())
  )
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-[#003A68] mb-6 flex items-center gap-2">
          Détails de la demande
        </h2>

        {/* STATUS */}
        <div className="mb-6">
          {(() => {
            let statusIcon, statusStyle, borderColor

            switch (request.changeStatusLabel) {
              case 'En attente':
                statusIcon = <Clock className="w-4 h-4" />
                statusStyle = 'bg-yellow-100 text-yellow-700'
                borderColor = 'border-yellow-400'
                break
              case 'Approuvé':
                statusIcon = <CheckCircle className="w-4 h-4" />
                statusStyle = 'bg-green-100 text-green-700'
                borderColor = 'border-green-500'
                break
              case 'Refusé':
                statusIcon = <XCircle className="w-4 h-4" />
                statusStyle = 'bg-red-100 text-red-700'
                borderColor = 'border-red-500'
                break
            }

            return (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${borderColor} ${statusStyle} font-semibold text-sm`}
              >
                {statusIcon} {formatStatus(request.changeStatusLabel)}
              </div>
            )
          })()}
        </div>

        {/* TEACHER */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
          <User className="w-8 h-8 text-gray-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Enseignant demandeur</h3>
            <p>Nom : {request.teacherName}</p>
            <p>Email : {request.teacherEmail || 'non renseigné'}</p>
            <p>Date de la demande : {formatDate(request.requestDate)}</p>
          </div>
        </div>

        {/* SESSION */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
          <GraduationCap className="w-8 h-8 text-gray-600 mt-1" />

          <div>
            <h3 className="font-semibold text-lg mb-2">
              {request.changeType === 'RoomChange'
                ? 'Informations actuelles de la séance'
                : 'Informations de la séance ratée'}
          </h3>

            <p>Matière : {request.courseName}</p>

            {program?.field && (
              <p>Formation : {program.name} - {program.field}</p>
            )}

            {groupNames.length > 0 && (
              <p>Groupes : {groupNames.join(', ')}</p>
            )}

            <p>
              <Clock className="inline w-4 h-4 mr-1" />
              Horaire : {formatDate(request.sessionDate)} de {formatTime(request.sessionStartTime)} à {formatTime(request.sessionEndTime)}
            </p>

            {room && (
              <>
                <p>
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Salle : {room.roomNumber}
                </p>

                <p>
                  <School className="inline w-4 h-4 mr-1" />
                  Type salle : {room.type}
                </p>

                <p>
                  <Users className="inline w-4 h-4 mr-1" />
                  Capacité : {room.capacity}
                </p>
              </>
            )}

            <p>
              <Building className="inline w-4 h-4 mr-1" />
              Bâtiment : {request.currentBuildingName}
            </p>
          </div>
        </div>
        {/* REASON */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
          <Calendar className="w-8 h-8 text-gray-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Motif</h3>
            <p>{request.reason}</p>
          </div>
        </div>
        {request.changeType === 'RoomChange' && request.changeStatusLabel === 'En attente' && (
          <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-gray-600" /> Sélectionner une salle disponible
            </h3>

            <input
              type="text"
              placeholder="Rechercher une salle..."
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="max-h-80 overflow-y-auto grid md:grid-cols-2 gap-4 pr-2">
              {filteredRooms.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-400">
                  Aucune salle disponible pour ce créneau
                </div>
              ) : (
                filteredRooms.map((room:any) => {
                const isSelected = selectedRoom?.roomId === room.roomId && selectedRoom?.buildingName === room.buildingName
                return (
                  <div
                    key={room.room + room.building}
                    onClick={() => setSelectedRoom(room)}
                    className={`cursor-pointer p-4 rounded-xl border flex justify-between items-center transition ${
                      isSelected ? 'bg-blue-100 border-blue-500 shadow-inner' : 'bg-white border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <p className="font-semibold"><MapPin className="inline w-4 h-4 text-gray-600 mr-1" /> Salle : {room.roomNumber}</p>
                      <p>Type salle: {room.type}</p>
                      <p>Bâtiment : {room.buildingName}</p>
                      <p>Capacité : {room.capacity}</p>
                    </div>
                    {isSelected && <Check className="text-blue-600 w-6 h-6" />}
                  </div>
                )
              })
            )}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition flex justify-center items-center gap-2"
              >
                <XCircle className="w-5 h-5" /> Refuser
              </button>
              <RejectReasonModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={(reason) => {
                  if (!request.id) return

                  rejectSessionChange(
                    {
                      id: request.id,
                      rejectionReason: reason,
                    },
                    {
                      onSuccess: () => {
                        localStorage.setItem(
                          'toast',
                          JSON.stringify({
                            message: 'Demande refusée avec succès',
                            type: 'success',
                          })
                        )
                        
                        setShowRejectModal(false)
                        onClose()

                        window.location.reload()

                      },
                      onError: () => {
                        setToast({ message: 'Erreur lors du refus', type: 'error' })
                      },
                    }
                  )
                }}
              />
              <button
                disabled={!selectedRoom}
                onClick={() => setShowConfirmRoom(true)}
                className={`flex-1 py-2 rounded-xl text-white flex justify-center items-center gap-2 transition ${
                  selectedRoom ? 'bg-green-500 hover:bg-green-600' : 'bg-green-300 cursor-not-allowed'
                }`}
              >
                <Check className="w-5 h-5" /> Approuver
              </button>

              <ConfirmModal
                isOpen={showConfirmRoom}
                onClose={() => setShowConfirmRoom(false)}
                onConfirm={() => {
                  if (!selectedRoom || !request.id) return

                  approveRoom(
                    {
                      id: request.id,
                      roomId: selectedRoom.roomId,
                    },
                    {
                      onSuccess: () => {
                        localStorage.setItem(
                          'toast',
                          JSON.stringify({
                            message: 'Demande refusée avec succès',
                            type: 'success',
                          })
                        )

                        setShowConfirmRoom(false)
                        onClose()

                        window.location.reload()
                      },
                      onError: () => {
                        setToast({ message: 'Erreur lors de l’approbation', type: 'error' })
                      },
                    }
                  )
                }}
                title="Confirmer l'approbation"
                description={`Vous êtes sur le point d'approuver le changement de salle.`}
                details={
                  <>
                    Nouvelle salle : <strong>{selectedRoom?.roomNumber}</strong>
                      <br />
                    Bâtiment: <strong>{selectedRoom?.buildingName}</strong>
                  </>
                }
                confirmColor="green"
              />
            </div>
          </div>
        )}
        {request.changeType === 'RoomChange' && request.changeStatusLabel !== 'Refusé' && oldRoom && (
          <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
            <MapPin className="w-8 h-8 text-gray-800 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">Ancienne salle</h3>
              <p>
                <MapPin className="inline w-4 h-4 text-gray-600 mr-1" /> Salle : {oldRoom.roomNumber} 
              </p>
              <p>
                <School className="inline w-4 h-4 text-gray-600 mr-1" /> Type salle : {oldRoom.type}
              </p>
              <p>
                <Users className="inline w-4 h-4 text-gray-600 mr-1" /> Capacité : {oldRoom.capacity}

              </p>
              <p>
                <Building className="inline w-4 h-4 text-gray-600 mr-1" /> Bâtiment : {oldBuilding?.name}
              </p>
            </div>
          </div>
        )}
        {request.changeType === 'SessionRecovery' && (
          <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
                <User className="w-8 h-8 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Enseignant concerné par la récupération</h3>
                  <p>Nom : {request.concernedTeacherName}</p>
                  <p>Email : {request.concernedTeacherEmail}</p>
                </div>
              </div>
          )}
        {request.changeType === 'SessionRecovery' && session && (
            
          <div className="bg-blue-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
            <Calendar className="w-8 h-8 text-blue-350 mt-1" />

            <div>
              <h3 className="font-semibold text-lg mb-2 text-blue-350">
                Proposition de récupération
              </h3>

              <p>
                <CalendarDays className="inline w-4 h-4 mr-1" />
                Date : {session.proposedDate ? formatDate(session.proposedDate) : 'Non définie'}
              </p>

              <p>
                <Clock className="inline w-4 h-4 mr-1" />
                Horaire : {formatTime(session.proposedStartTime)} - {formatTime(session.proposedEndTime)}
              </p>

              {proposedRoom && (
                <>
                  <p>
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Salle : {proposedRoom.roomNumber}
                  </p>

                  <p>
                    <School className="inline w-4 h-4 mr-1" />
                    Type salle : {proposedRoom.type}
                  </p>

                  <p>
                    <Users className="inline w-4 h-4 mr-1" />
                    Capacité : {proposedRoom.capacity}
                  </p>

                  <p>
                    <Building className="inline w-4 h-4 mr-1" />
                    Bâtiment : {proposedBuilding?.name}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        {request.changeType === 'SessionRecovery' &&
          request.changeStatusLabel === 'Refusé' &&
          session && (
            
            <div className="bg-orange-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
              
              <CalendarDays className="w-8 h-8 text-orange-350 mt-1" />

              <div>
                <h3 className="font-semibold text-lg mb-2 text-orange-350">
                  Proposition alternative
                </h3>

                <p>
                  <CalendarDays className="inline w-4 h-4 mr-1" />
                  Date : {session.counterProposalDate ? formatDate(session.counterProposalDate) : 'Non définie'}
                </p>

                <p>
                  <Clock className="inline w-4 h-4 mr-1" />
                  Horaire : {formatTime(session.counterProposalStartTime)} - {formatTime(session.counterProposalEndTime)}
                </p>

                {counterRoom && (
                  <>
                    <p>
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Salle : {counterRoom.roomNumber}
                    </p>

                    <p>
                      <School className="inline w-4 h-4 mr-1" />
                      Type salle : {counterRoom.type}
                    </p>

                    <p>
                      <Users className="inline w-4 h-4 mr-1" />
                      Capacité : {counterRoom.capacity}
                    </p>

                    <p>
                      <Building className="inline w-4 h-4 mr-1" />
                      Bâtiment : {counterBuilding?.name}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        {request.changeType === 'SessionRecovery' &&
          request.changeStatusLabel === 'En attente' && (
            
            <div className="mt-4 flex gap-4">
                  
                  <button
                    onClick={() => setShowAlternativeModal(true)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Refuser / Proposer autre
                  </button>

                  <button
                    onClick={() => setShowConfirmAccept(true)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Accepter
                  </button>

                  {/* Confirm accept */}
                  <ConfirmModal
                    isOpen={showConfirmAccept}
                    onClose={() => setShowConfirmAccept(false)}
                    onConfirm={() => {
                      setToast({ message: 'Demande approuvée', type: 'success' })
                      setShowConfirmAccept(false)
                      onClose()
                    }}
                    title="Confirmer l'acceptation"
                    description={`Vous êtes sur le point d'accepter le créneau proposé.`}
                    details={
                      <>
                        Date : <strong>{session?.proposedDate ? formatDate(session.proposedDate) : '-'}</strong><br />
                        Horaire : <strong>
                          {formatTime(session?.proposedStartTime)} - {formatTime(session?.proposedEndTime)}
                        </strong><br />
                        Salle : <strong>{proposedRoom?.roomNumber}</strong><br />
                        Bâtiment : <strong>{proposedBuilding?.name}</strong>
                      </>
                    }
                    confirmColor="green"
                  />

                  {/* Alternative slot */}
                  <AlternativeSlotModal
                    isOpen={showAlternativeModal}
                    onClose={() => setShowAlternativeModal(false)}
                    onConfirm={(slot) => {
                      setSelectedSlot(slot)
                      setShowAlternativeModal(false)
                      setShowConfirmAlternative(true)
                    }}
                  />

                  <ConfirmModal
                    isOpen={showConfirmAlternative}
                    onClose={() => setShowConfirmAlternative(false)}
                    onConfirm={() => {
                      setToast({ message: 'Créneau alternatif proposé', type: 'success' })
                      setShowConfirmAlternative(false)
                      onClose()
                    }}
                    title="Confirmer le créneau alternatif"
                    description="Vous êtes sur le point de refuser la proposition et de suggérer un créneau alternatif."
                    details={
                      selectedSlot && (
                        <>
                          Nouveau créneau : <strong>
                            {selectedSlot.date} de {selectedSlot.start} à {selectedSlot.end}
                          </strong>
                          <br />
                          Salle : <strong>{selectedSlot.room}</strong><br />
                          Bâtiment : <strong>{selectedSlot.building}</strong>
                        </>
                      )
                    }
                    confirmColor="red"
                  />
                </div>
          )}

        {/* REJECT */}
        {request.changeStatusLabel === 'Refusé' &&
          request.changeType === 'RoomChange' &&
          session?.rejectionReason && (
            <div className="bg-red-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
              <XCircle className="w-8 h-8 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-red-600">
                  Motif du refus
                </h3>
                <p>{session.rejectionReason}</p>
              </div>
            </div>
        )}

      </div>
    </div>
  )
}