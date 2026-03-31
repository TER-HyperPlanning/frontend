import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import RequestCard from '@/components/requests/RequestCard'
import StatsCard from '@/components/requests/StatsCard'
import PageLayout from '@/layout/PageLayout'
import RequestDetailsModal from '@/components/requests/RequestDetailsModal'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import Toast from '@/components/requests/Toast'

type RequestStatus = 'En attente' | 'Approuvé' | 'Refusé'
type RequestType = 'Changement de salle' |'Récupération de séance'

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
  currentBuilding?: string
  proposedRoom?: string
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
    formation: 'Master Informatique - M2',
    sessionTime: '15/02/2026 · 09:00 - 11:00',
    requestDate: '10/02/2026 à 08:45',
    groups: 'G1, G2',
    currentRoom: '101',
    currentBuilding: 'A',
    proposedRoom: '203',
    proposedBuilding: 'A',
    capacity: 30,
    reason: 'Salle trop petite pour le groupe',
  },
  // ----------------- Récupération de séance approuvée -----------------
  {
    status: 'Approuvé',
    teacher: 'Jean Martin',
    email: 'jean.martin@example.com',
    type: 'Récupération de séance',
    subject: 'Mathématiques Appliquées',
    formation: 'Master Informatique - M1',
    sessionTime: '20/02/2026 · 14:00 - 16:00',
    requestDate: '15/02/2026 à 10:30',
    groups: 'G1',
    currentRoom: '105',
    currentBuilding: 'C',
    reason: 'Proposition de récupération pour le cours annulé',
    concernedTeacher: 'Marie Dupont',
    concernedTeacherEmail: 'marie.dupont@example.com',
    proposedSlot: '22/02/2026 · 10:00 - 12:00',
    proposedSlotRoom: '205',
    proposedSlotBuilding: 'D',
  },
  // ----------------- Changement de salle refusé -----------------
  {
    status: 'Refusé',
    teacher: 'Alice Dubois',
    email: 'alice.dubois@example.com',
    type: 'Changement de salle',
    subject: 'Physique Quantique',
    formation: 'Master Physique - M1',
    sessionTime: '25/02/2026 · 13:00 - 15:00',
    requestDate: '20/02/2026 à 09:15',
    groups: 'G1, G2, G3',
    currentRoom: '102',
    currentBuilding: 'B',
    proposedRoom: '204',
    proposedBuilding: 'B',
    capacity: 45,
    reason: 'Effectif plus important que prévu (45 étudiants au lieu de 30)',
    refusalReason: 'Aucune salle disponible correspondant à la demande',
  },
  // ----------------- Récupération de séance refusée -----------------
  {
    status: 'Refusé',
    teacher: 'Alice Durand',
    email: 'alice.durand@example.com',
    type: 'Récupération de séance',
    subject: 'Physique Théorique',
    formation: 'Master Physique - M2',
    sessionTime: '18/02/2026 · 09:00 - 11:00',
    requestDate: '12/02/2026 à 11:15',
    groups: 'G1, G2',
    currentRoom: '210',
    currentBuilding: 'B',
    reason: 'Proposition de récupération pour le cours annulé',
    concernedTeacher: 'Paul Lefevre',
    concernedTeacherEmail: 'paul.lefevre@example.com',
    proposedSlot: '25/02/2026 · 14:00 - 16:00',
    proposedSlotRoom: '215',
    proposedSlotBuilding: 'B',
    alternativeSlot: '27/02/2026 · 09:00 - 11:00',
    alternativeSlotRoom: '220',
    alternativeSlotBuilding: 'B',
    refusalReason: 'Un créneau mieux adapté',
  },
  // ----------------- NOUVEAU : Changement de salle en attente -----------------
  {
    status: 'En attente',
    teacher: 'Marc Petit',
    email: 'marc.petit@example.com',
    type: 'Changement de salle',
    subject: 'Chimie Organique',
    formation: 'Master Chimie - M1',
    sessionTime: '28/02/2026 · 10:00 - 12:00',
    requestDate: '22/02/2026 à 09:00',
    groups: 'G1, G2',
    currentRoom: '110',
    currentBuilding: 'C',
    reason: 'Salle actuelle trop petite pour le groupe',
  },
  // ----------------- NOUVEAU : Récupération de séance en attente -----------------
  {
    status: 'En attente',
    teacher: 'Laura Bernard',
    email: 'laura.bernard@example.com',
    type: 'Récupération de séance',
    subject: 'Programmation Web',
    formation: 'Master Informatique - M1',
    sessionTime: '05/03/2026 · 10:00 - 12:00',
    requestDate: '28/02/2026 à 14:20',
    groups: 'G1, G2',
    currentRoom: '108',
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

function PageHeader() {
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-[#003A68]">Gestion des demandes</h1>
      <p className="text-gray-500 mt-2">Consultez et gérez les demandes des enseignants.</p>
    </div>
  )
}

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
  // Tri : les demandes "En attente" en premier
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
        <PageHeader />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 overflow-hidden">
          <StatsCard
            label="En attente"
            value={pendingCount}
            valueColor="text-yellow-500"
            iconColor="text-yellow-400"
            icon={<Clock className="w-10 h-10" />}
          />
          <StatsCard
            label="Approuvées"
            value={approvedCount}
            valueColor="text-green-500"
            iconColor="text-green-400"
            icon={<CheckCircle className="w-10 h-10" />}
          />
          <StatsCard
            label="Refusées"
            valueColor="text-red-500"
            iconColor="text-red-400"
            value={refusedCount}
            icon={<XCircle className="w-10 h-10" />}
          />
        </div>

        {/* Filtres */}
        <div className="bg-[#F4F6F8] rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-4 overflow-hidden">
          <input
            type="text"
            placeholder="Rechercher un professeur, matiére, formation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as RequestType | '')}
            className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
          >
            <option value="">Tous les types</option>
            <option value="Changement de salle">Changement de salle</option>
            <option value="Récupération de séance">Récupération de séance</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RequestStatus | '')}
            className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Approuvé">Approuvé</option>
            <option value="Refusé">Refusé</option>
          </select>
        </div>

        {/* Liste des demandes */}
        <div className="flex flex-col gap-6 overflow-y-auto pt-2">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, index) => (
              <RequestCard
                key={index}
                {...req}
                onViewDetails={() => handleViewDetails(req)}
              />
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
            setToast={setToast} // ← AJOUT
          />
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </PageLayout>
  )
}