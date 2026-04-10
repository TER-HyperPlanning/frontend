import { X, User, GraduationCap, Clock, MapPin, Check, XCircle, Calendar, Building, CheckCircle, Users, School } from 'lucide-react'
import { useState } from 'react'
import type { Request } from '@/routes/(app)/requests'
import AlternativeSlotModal from './AlternativeSlotModal'
import ConfirmModal from './ConfirmModal'

interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: Request
  setToast: (toast: { message: string; type: 'success' | 'error' }) => void
}

interface AvailableRoom {
  room: string
  building: string
  capacity: number
  type: string
}

export default function RequestDetailsModal({ isOpen, onClose, request, setToast }: RequestDetailsModalProps) {
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null)
  const [roomSearch, setRoomSearch] = useState('')
  const [showAlternativeModal, setShowAlternativeModal] = useState(false)
  const [showConfirmAlternative, setShowConfirmAlternative] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [showConfirmAccept, setShowConfirmAccept] = useState(false)
  const [showConfirmRoom, setShowConfirmRoom] = useState(false)

  // Exemple de salles disponibles
  const availableRooms: AvailableRoom[] = [
    { room: '201', building: 'A', capacity: 30, type: 'Salle TD' },
    { room: '202', building: 'A', capacity: 35, type: 'Salle informatique' },
    { room: '301', building: 'B', capacity: 40, type: 'Amphithéâtre' },
  ]

  if (!isOpen) return null

  const filteredRooms = availableRooms.filter((room) =>
    room.room.toLowerCase().includes(roomSearch.toLowerCase()) ||
    room.building.toLowerCase().includes(roomSearch.toLowerCase()) ||
    room.type.toLowerCase().includes(roomSearch.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-[#003A68] mb-6 flex items-center gap-2">
          Détails de la demande
        </h2>
        <div className="mb-6">
        {(() => {
          let statusIcon, statusStyle, borderColor

          switch (request.status) {
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
              {statusIcon} {request.status}
            </div>
          )
        })()}
      </div>

        {/* Enseignant */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
          <User className="w-8 h-8 text-gray-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Enseignant</h3>
            <p>Nom : {request.teacher}</p>
            <p>Email : {request.email || 'non renseigné'}</p>
            <p>Date de la demande : {request.requestDate}</p>
          </div>
        </div>

        {/* Séance */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
          <GraduationCap className="w-8 h-8 text-gray-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2"> Informations actuelles de la séance</h3>
            <p>Matière : {request.subject}</p>
            <p>Formation : {request.formation}</p>
            {request.groups && <p>Groupes : {request.groups}</p>}
            <p>
              <Clock className="inline w-4 h-4 text-gray-600 mr-1" /> Horaire : {request.sessionTime}
            </p>
            {request.currentRoom && (
              <p>
                <MapPin className="inline w-4 h-4 text-gray-600 mr-1" /> Salle : {request.currentRoom} 
              </p>
            )}
            {request.currentRoomType && (
              <p>
                <School className="inline w-4 h-4 text-gray-600 mr-1" /> Type salle : {request.currentRoomType}
              </p>
            )}
            {request.currentRoomCapacity && (
              <p>
                <Users className="inline w-4 h-4 text-gray-600 mr-1" /> Capacité : {request.currentRoomCapacity}
              </p>
            )}
            {request.currentBuilding && (
                <p>
                  <Building className="inline w-4 h-4 text-gray-600 mr-1" /> Bâtiment : {request.currentBuilding}
                </p>
              )}
          </div>
        </div>

        {/* Motif */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
          <Calendar className="w-8 h-8 text-gray-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Motif</h3>
            <p>{request.reason}</p>
          </div>
        </div>
        {/* Changement de salle */}
        {request.type === 'Changement de salle' && request.status === 'En attente' && (
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

            <div className="grid md:grid-cols-2 gap-4">
              {filteredRooms.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-400">
                  Aucune salle disponible pour ce créneau
                </div>
              ) : (
                filteredRooms.map((room) => {
                const isSelected = selectedRoom?.room === room.room && selectedRoom?.building === room.building
                return (
                  <div
                    key={room.room + room.building}
                    onClick={() => setSelectedRoom(room)}
                    className={`cursor-pointer p-4 rounded-xl border flex justify-between items-center transition ${
                      isSelected ? 'bg-blue-100 border-blue-500 shadow-inner' : 'bg-white border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <p className="font-semibold"><MapPin className="inline w-4 h-4 text-gray-600 mr-1" /> Salle : {room.room}</p>
                      <p>Type : {room.type}</p>
                      <p>Bâtiment : {room.building}</p>
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
                onClick={() => {
                  setToast({ message: 'Demande refusée', type: 'error' })
                  onClose()
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition flex justify-center items-center gap-2"
              >
                <XCircle className="w-5 h-5" /> Refuser
              </button>
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
                  setToast({ message: 'Changement de salle approuvé', type: 'success' })
                  setShowConfirmRoom(false)
                  onClose()
                }}
                title="Confirmer l'approbation"
                description={`Vous êtes sur le point d'approuver le changement de salle pour la séance de ${request.subject}.`}
                details={
                  <>
                    Séance du <strong>{request.sessionTime}</strong>
                    <br />
                    Nouvelle salle : <strong>{selectedRoom?.room}</strong>
                      <br />
                    Bâtiment: <strong>{selectedRoom?.building}</strong>
                  </>
                }
                confirmColor="green"
              />
            </div>
          </div>
        )}


        {/* Salle proposée déjà approuvée */}
        {request.type === 'Changement de salle' && request.recentRoom && request.status !== 'Refusé' && (
          <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
            <MapPin className="w-8 h-8 text-gray-800 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">Ancienne salle</h3>
              <p>
                <MapPin className="inline w-4 h-4 text-gray-600 mr-1" /> Salle : {request.recentRoom} 
              </p>
              <p>
                <School className="inline w-4 h-4 text-gray-600 mr-1" /> Type salle : {request.recentRoomType}
              </p>
              <p>
                <Users className="inline w-4 h-4 text-gray-600 mr-1" /> Capacité : {request.recentRoomCapacity}
              </p>
              <p>
                <Building className="inline w-4 h-4 text-gray-600 mr-1" /> Bâtiment : {request.recentBuilding}
              </p>
            </div>
          </div>
        )}
        {/* Récupération de séance */}
        {request.type === 'Proposition de récupération de séance' && (
          <>
            <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
              <User className="w-8 h-8 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Enseignant concerné</h3>
                <p>Nom : {request.concernedTeacher}</p>
                <p>Email : {request.concernedTeacherEmail}</p>
              </div>
            </div>

            {request.recentSlot && (
              <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
                <Calendar className="w-8 h-8 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Ancien Créneau</h3>
                  <p>
                    <Clock className="inline w-4 h-4 text-gray-600 mr-1" /> Horaire : {request.recentSlot}
                  </p>
                  {request.currentRoom && (
                    <p>
                      <MapPin className="inline w-4 h-4 text-gray-600 mr-1" /> Salle : {request.recentRoom} 
                    </p>
                  )}
                  {request.recentRoomType && (
                    <p>
                      <School className="inline w-4 h-4 text-gray-600 mr-1" /> Type salle : {request.recentRoomType}
                    </p>
                  )}
                  {request.recentRoomCapacity && (
                    <p>
                      <Users className="inline w-4 h-4 text-gray-600 mr-1" /> Capacité : {request.recentRoomCapacity}
                    </p>
                  )}
                  {request.currentBuilding && (
                      <p>
                        <Building className="inline w-4 h-4 text-gray-600 mr-1" /> Bâtiment : {request.recentBuilding}
                      </p>
                    )}
                </div>
              </div>
            )}
            {request.proposedSlot &&(request.status === 'En attente' || request.status === 'Refusé') && (
              <div className="bg-gray-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
                <Clock className="w-8 h-8 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Créneau proposé par le responsable</h3>
                  <p>
                    <Clock className="inline w-4 h-4 text-gray-600 mr-1" /> Horaire : {request.proposedSlot}
                  </p>
                  {request.currentRoom && (
                    <p>
                      <MapPin className="inline w-4 h-4 text-gray-600 mr-1" /> Salle : {request.proposedRoom}
                    </p>
                  )}
                  {request.proposedRoomType && (
                    <p>
                      <School className="inline w-4 h-4 text-gray-600 mr-1" /> Type salle : {request.proposedRoomType}
                    </p>
                  )}
                  {request.proposedRoomCapacity && (
                    <p>
                      <Users className="inline w-4 h-4 text-gray-600 mr-1" /> Capacité : {request.proposedRoomCapacity}
                    </p>
                  )}
                  {request.currentBuilding && (
                      <p>
                        <Building className="inline w-4 h-4 text-gray-600 mr-1" /> Bâtiment : {request.proposedBuilding}
                      </p>
                    )}
                </div>
              </div>
            )}
            {request.status === 'En attente' && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setShowAlternativeModal(true)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                >
                  <XCircle className="w-5 h-5" /> Refuser / Proposer autre
                </button>
                <button
                  onClick={() => setShowConfirmAccept(true)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                >
                  <Check className="w-5 h-5" /> Accepter
                </button>

                <ConfirmModal
                  isOpen={showConfirmAccept}
                  onClose={() => setShowConfirmAccept(false)}
                  onConfirm={() => {
                    setToast({ message: 'Demande approuvée', type: 'success' })
                    setShowConfirmAccept(false)
                    onClose()
                  }}
                  title="Confirmer l'acceptation"
                  description={`Vous êtes sur le point d'accepter le créneau proposé par ${request.teacher}.`}
                  details={
                    <>
                    La séance aura lieu le <strong>{request.proposedSlot}</strong> en salle <strong>{request.proposedRoom}</strong> Bâtiment: <strong>{request.proposedBuilding}</strong>
                    </>
                  }
                  confirmColor="green"
                />

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
                        Nouveau créneau : <strong>{selectedSlot.date} de {selectedSlot.start} à {selectedSlot.end}</strong> en salle <strong>{selectedSlot.room}</strong> Bâtiment: <strong>{selectedSlot.building}</strong>
                      </>
                    )
                  }
                  confirmColor="red"
                />
              </div>
            )}
          </>
        )}
        
        {/* Motif de refus */}
        {request.status === 'Refusé' && request.rejectReason && (
          <div className="bg-red-50 p-5 rounded-2xl mb-5 shadow-sm flex gap-4 items-start">
            <XCircle className="w-8 h-8 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-red-600">Motif du refus</h3>
              <p>{request.rejectReason}</p>
            </div>
          </div>
        )}

        
      </div>
    </div>
  )
}