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
  sessionTime?: string
  requestDate: string
  groups?: string
  currentRoom?: string
  currentRoomType?: string
  currentRoomCapacity?: string
  currentBuilding?: string
  recentRoom?: string
  recentRoomCapacity?: string
  recentRoomType?: string
  recentBuilding?: string
  reason?: string
  rejectReason?:string
  concernedTeacher?:string
  concernedTeacherEmail?:string
  // séance ratée (celle du planning original)
  missedSlot?: string
  missedRoom?: string
  missedRoomType?: string
  missedRoomCapacity?: string
  missedBuilding?: string

  // proposition du professeur
  teacherProposalSlot?: string
  teacherProposalRoom?: string
  teacherProposalRoomType?: string
  teacherProposalRoomCapacity?: string
  teacherProposalBuilding?: string
  // alternantive
  adminSlot?: string
  adminRoom?: string
  adminRoomType?: string
  adminRoomCapacity?: string
  adminBuilding?: string
}

const mockRequests: Request[] = [
  // ----------------- Changement de salle approuvé -----------------
  {
    status: 'Approuvé',
    teacher: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    type: 'Changement de salle',
    subject: 'Informatique Avancée',
    formation: 'M2 MIAGE Informatique décisionnelle',
    sessionTime: '12/02/2026 · 10:00 - 12:00',
    requestDate: '08/02/2026 à 09:15',
    groups: 'G1, G3',
    currentRoom: '101',
    currentRoomType: 'Salle TD',
    currentRoomCapacity: '20',
    currentBuilding: 'A',
    recentRoom: '205',
    recentRoomType: 'Salle informatique',
    recentBuilding: 'B',
    recentRoomCapacity: '30',
    reason: 'Effectif plus important que prévu',
  },

  // ----------------- Changement de salle en attente -----------------
  {
    status: 'En attente',
    teacher: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    type: 'Changement de salle',
    subject: 'Base de données avancées',
    formation: 'M2 MIAGE Informatique décisionnelle',
    sessionTime: '14/02/2026 · 14:00 - 16:00',
    requestDate: '09/02/2026 à 11:30',
    groups: 'G2',
    currentRoom: '101',
    currentRoomType: 'Salle TD',
    currentRoomCapacity: '20',
    currentBuilding: 'A',
    reason: 'Besoin d’une salle plus adaptée aux travaux pratiques',
  },

  // ----------------- Changement de salle refusé -----------------
  {
    status: 'Refusé',
    teacher: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    type: 'Changement de salle',
    subject: 'Algorithmique avancée',
    formation: 'M2 MIAGE Informatique décisionnelle',
    sessionTime: '16/02/2026 · 08:00 - 10:00',
    requestDate: '10/02/2026 à 10:00',
    groups: 'G1, G2',
    currentRoom: '101',
    currentRoomType: 'Salle TD',
    currentRoomCapacity: '20',
    currentBuilding: 'A',
    reason: 'Salle trop petite pour le groupe',
    rejectReason: 'Aucune salle disponible dans le bâtiment A',
  },
  // ----------------- proposition en attente -----------------
  {
  status: 'En attente',
  type: 'Proposition de récupération de séance',
  teacher: 'Sophie Laurent',
  email: 'sophie.laurent@example.com',
  subject: 'Systèmes distribués',
  formation: 'M2 MIAGE Informatique décisionnelle',
  requestDate: '11/02/2026 à 13:20',
  groups: 'G1, G2',
  concernedTeacher:'Sophie Bourse',
  concernedTeacherEmail:'sophie.bourse@gmail.com',

  missedSlot: '15/02/2026 · 10:00 - 12:00',
  missedRoom: '101',
  missedRoomType: 'Salle TD',
  missedRoomCapacity: '20',
  missedBuilding: 'A',

  teacherProposalSlot: '20/02/2026 · 14:00 - 16:00',
  teacherProposalRoom: '202',
  teacherProposalRoomType: 'Salle informatique',
  teacherProposalRoomCapacity: '30',
  teacherProposalBuilding: 'B'
},
{
  status: 'Approuvé',
  type: 'Proposition de récupération de séance',
  teacher: 'Sophie Laurent',
  email: 'sophie.laurent@example.com',
  subject: 'Systèmes distribués',
  formation: 'M2 MIAGE Informatique décisionnelle',
  sessionTime: '18/02/2026 · 09:00 - 11:00',
  requestDate: '11/02/2026 à 13:20',
  groups: 'G1, G2',
  concernedTeacher:'Maria Bourse',
  concernedTeacherEmail:'maria.bourse@gmail.com',

  missedSlot: '15/02/2026 · 10:00 - 12:00',
  missedRoom: '101',
  missedRoomType: 'Salle TD',
  missedRoomCapacity: '20',
  missedBuilding: 'A',

  teacherProposalSlot: '20/02/2026 · 14:00 - 16:00',
  teacherProposalRoom: '202',
  teacherProposalRoomType: 'Salle informatique',
  teacherProposalRoomCapacity: '30',
  teacherProposalBuilding: 'B'
},
{
  status: 'Refusé',
  type: 'Proposition de récupération de séance',
  teacher: 'Sophie Laurent',
  email: 'sophie.laurent@example.com',
  subject: 'Réseaux et systèmes',
  formation: 'M2 MIAGE Informatique décisionnelle',
  sessionTime: '20/02/2026 · 10:00 - 12:00',
  requestDate: '12/02/2026 à 09:10',
  groups: 'G3',
  concernedTeacher:'Portic Yani',
  concernedTeacherEmail:'postic.yani@gmail.com',

  missedSlot: '16/02/2026 · 08:00 - 10:00',
  missedRoom: '101',
  missedRoomType: 'Salle TD',
  missedRoomCapacity: '20',
  missedBuilding: 'A',

  teacherProposalSlot: '20/02/2026 · 14:00 - 16:00',
  teacherProposalRoom: '202',
  teacherProposalRoomType: 'Salle informatique',
  teacherProposalRoomCapacity: '30',
  teacherProposalBuilding: 'B',
  
  adminSlot: '20/02/2026 · 14:00 - 16:00',
  adminRoom: '202',
  adminRoomType: 'Salle informatique',
  adminRoomCapacity: '30',
  adminBuilding: 'B',
  
  rejectReason: 'Créneau mieux adapté avec le planning'
}


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