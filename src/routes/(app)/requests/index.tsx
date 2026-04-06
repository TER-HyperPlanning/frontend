import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import RequestCard from '@/components/requests/RequestCard'
import PageLayout from '@/layout/PageLayout'
import RequestDetailsModal from '@/components/requests/RequestDetailsModal'
import Toast from '@/components/requests/Toast'
import Header from '@/components/requests/Header'

type RequestStatus = 'En attente' | 'Approuvé' | 'Refusé'
type RequestType = 'Changement de salle' |'Proposition de récupération de séance'

export interface Request {
  status: RequestStatus
  teacher: string
  email?: string
  type: RequestType
  subject: string
  formation: string
  sessionTime: string
  requestDate: string
  groups?: string
  currentRoom?: string
  currentRoomType?: string
  currentBuilding?: string
  proposedRoom?: string
  proposedRoomType?: string
  proposedBuilding?: string 
  capacity?: number
  reason: string
  refusalReason?: string
  concernedTeacher?: string
  concernedTeacherEmail?: string
  proposedSlot?: string 
  proposedSlotRoom?: string 
  proposedSlotBuilding?: string
  alternativeSlot?: string
  alternativeSlotRoom?: string
  alternativeSlotRoomType?: string
  alternativeSlotBuilding?: string
}

const mockRequests: Request[] = [
  // ----------------- Changement de salle approuvé -----------------
  {
    status: 'Approuvé',
    teacher: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    type: 'Changement de salle',
    subject: 'Informatique Avancée',
    formation: 'M2 Miage Informatique décisionnelle',
    sessionTime: '15/02/2026 · 09:00 - 11:00',
    requestDate: '10/02/2026 à 08:45',
    groups: 'G1, G2',
    currentRoom: '101',
    currentRoomType: 'Informatique',
    currentBuilding: 'A',
    proposedRoom: '203',
    proposedRoomType: 'Informatique',
    proposedBuilding: 'A',
    capacity: 30,
    reason: 'Salle trop petite pour le groupe',
  },
  // ----------------- Récupération de séance approuvée -----------------
  {
    status: 'Approuvé',
    teacher: 'Jean Martin',
    email: 'jean.martin@example.com',
    type: 'Proposition de récupération de séance',
    subject: 'Mathématiques Appliquées',
    formation: 'M1 Informatique',
    sessionTime: '20/02/2026 · 14:00 - 16:00',
    requestDate: '15/02/2026 à 10:30',
    groups: 'G1',
    currentRoom: '105',
    currentRoomType: 'TD',
    currentBuilding: 'C',
    reason: 'Proposition de récupération pour le cours annulé',
    concernedTeacher: 'Marie Dupont',
    concernedTeacherEmail: 'marie.dupont@example.com',
    proposedSlot: '22/02/2026 · 10:00 - 12:00',
    proposedSlotRoom: '205',
    proposedRoomType: 'Informatique',
    proposedSlotBuilding: 'D',
  },
  // ----------------- Changement de salle refusé -----------------
  {
    status: 'Refusé',
    teacher: 'Alice Dubois',
    email: 'alice.dubois@example.com',
    type: 'Changement de salle',
    subject: 'Physique Quantique',
    formation: 'M1 Physique',
    sessionTime: '25/02/2026 · 13:00 - 15:00',
    requestDate: '20/02/2026 à 09:15',
    groups: 'G1, G2, G3',
    currentRoom: '102',
    currentRoomType: 'Amphithéâtre',
    currentBuilding: 'B',
    capacity: 45,
    reason: 'Effectif plus important que prévu (45 étudiants au lieu de 30)',
    refusalReason: 'Aucune salle disponible correspondant à la demande',
  },
  // ----------------- Récupération de séance refusée -----------------
  {
    status: 'Refusé',
    teacher: 'Alice Durand',
    email: 'alice.durand@example.com',
    type: 'Proposition de récupération de séance',
    subject: 'Physique Théorique',
    formation: 'M2 Physique',
    sessionTime: '18/02/2026 · 09:00 - 11:00',
    requestDate: '12/02/2026 à 11:15',
    groups: 'G1, G2',
    currentRoom: '210',
    currentRoomType: 'Informatique',
    currentBuilding: 'B',
    reason: 'Proposition de récupération pour le cours annulé',
    concernedTeacher: 'Paul Lefevre',
    concernedTeacherEmail: 'paul.lefevre@example.com',
    proposedSlot: '25/02/2026 · 14:00 - 16:00',
    proposedSlotRoom: '215',
    proposedRoomType: 'Informatique',
    proposedSlotBuilding: 'B',
    alternativeSlot: '27/02/2026 · 09:00 - 11:00',
    alternativeSlotRoom: '220',
    alternativeSlotRoomType: 'Informatique',
    alternativeSlotBuilding: 'B',
    refusalReason: 'Un créneau mieux adapté',
  },
  // ----------------- Changement de salle en attente -----------------
  {
    status: 'En attente',
    teacher: 'Marc Petit',
    email: 'marc.petit@example.com',
    type: 'Changement de salle',
    subject: 'Chimie Organique',
    formation: 'M1 Chimie',
    sessionTime: '28/02/2026 · 10:00 - 12:00',
    requestDate: '22/02/2026 à 09:00',
    groups: 'G1, G2',
    currentRoom: '110',
    currentRoomType: 'TD',
    currentBuilding: 'C',
    reason: 'Salle actuelle trop petite pour le groupe',
  },
  // ----------------- Récupération de séance en attente -----------------
  {
    status: 'En attente',
    teacher: 'Laura Bernard',
    email: 'laura.bernard@example.com',
    type: 'Proposition de récupération de séance',
    subject: 'Programmation Web',
    formation: 'M1 Informatique',
    sessionTime: '05/03/2026 · 10:00 - 12:00',
    requestDate: '28/02/2026 à 14:20',
    groups: 'G1, G2',
    currentRoom: '108',
    currentRoomType: 'Amphithéâtre',
    currentBuilding: 'A',
    reason: 'Cours annulé à cause d’un problème technique',
    concernedTeacher: 'Thomas Moreau',
    concernedTeacherEmail: 'thomas.moreau@example.com',
    proposedSlot: '08/03/2026 · 14:00 - 16:00',
    proposedSlotRoom: '210',
    proposedSlotBuilding: 'B',
  },
]

export const Route = createFileRoute('/(app)/requests/')({
  component: RequestsPage,
})


export default function RequestsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<RequestStatus | ''>('')
  const [filterType, setFilterType] = useState<RequestType | ''>('')
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const filteredRequests = mockRequests
    .filter((req) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        req.teacher.toLowerCase().includes(searchLower) ||
        req.subject.toLowerCase().includes(searchLower) ||
        req.formation.toLowerCase().includes(searchLower) ||
        req.type.toLowerCase().includes(searchLower)
      return (
        matchesSearch &&
        (filterStatus === '' || req.status === filterStatus) &&
        (filterType === '' || req.type === filterType)
      )
    })
    .sort((a, b) => {
      if (a.status === 'En attente' && b.status !== 'En attente') return -1
      if (a.status !== 'En attente' && b.status === 'En attente') return 1
      return 0
    })

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const pendingCount = mockRequests.filter((r) => r.status === 'En attente').length
  const approvedCount = mockRequests.filter((r) => r.status === 'Approuvé').length
  const refusedCount = mockRequests.filter((r) => r.status === 'Refusé').length

  return (
    <PageLayout className="min-h-screen bg-white py-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <Header
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          refusedCount={refusedCount}
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {/* Liste des demandes */}
        <div className="flex flex-col gap-6 overflow-y-auto pt-2">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, index) => (
              <RequestCard key={index} {...req} onViewDetails={() => handleViewDetails(req)} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">Aucune demande trouvée.</div>
          )}
        </div>

        {/* Modal */}
        {selectedRequest && (
          <RequestDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            request={selectedRequest}
            setToast={setToast}
          />
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </PageLayout>
  )
}