import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import RequestCard from '@/components/requests/RequestCard'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import StatsCard from '@/components/requests/StatsCard'
import PageLayout from '@/layout/PageLayout'

type RequestStatus = 'En attente' | 'Approuvé' | 'Refusé'
type RequestType =
  | 'Changement de salle'
  | 'Changement de statut'
  | 'Récupération de séance'

interface Request {
  status: RequestStatus
  teacher: string
  type: RequestType
  subject: string
  formation: string
  sessionTime: string
  requestDate: string
}

const mockRequests: Request[] = [
  {
    status: 'En attente',
    teacher: 'Marie Dupont',
    type: 'Changement de salle',
    subject: 'Mathématiques Appliquées',
    formation: 'Master Informatique - M1',
    sessionTime: '10/02/2026 · 14:00 - 16:00',
    requestDate: '07/02/2026 à 09:30',
  },
  {
    status: 'Approuvé',
    teacher: 'Sophie Laurent',
    type: 'Récupération de séance',
    subject: 'Informatique Avancée',
    formation: 'Master Informatique - M2',
    sessionTime: '15/02/2026 · 09:00 - 11:00',
    requestDate: '10/02/2026 à 08:45',
  },
  {
    status: 'Refusé',
    teacher: 'Paul Girard',
    type: 'Changement de salle',
    subject: 'Chimie Organique',
    formation: 'Licence Chimie - L3',
    sessionTime: '17/02/2026 · 13:00 - 15:00',
    requestDate: '12/02/2026 à 10:20',
  },
]

export const Route = createFileRoute('/(app)/requests/')({
  component: RequestsPage,
})

function PageHeader() {
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-[#003A68]">
        Gestion des demandes
      </h1>
      <p className="text-gray-500 mt-2">
        Consultez et gérez les demandes des enseignants.
      </p>
    </div>
  )
}

function RequestsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<RequestStatus | ''>('')
  const [filterType, setFilterType] = useState<RequestType | ''>('')

  const filteredRequests = mockRequests.filter((req) => {
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

  const pendingCount = mockRequests.filter(
    (r) => r.status === 'En attente'
  ).length
  const approvedCount = mockRequests.filter(
    (r) => r.status === 'Approuvé'
  ).length
  const refusedCount = mockRequests.filter(
    (r) => r.status === 'Refusé'
  ).length

  return (
    <PageLayout className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">

        <PageHeader />

        <div className="grid md:grid-cols-3 gap-6 mb-12">
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
            value={refusedCount}
            valueColor="text-red-500"
            iconColor="text-red-400"
            icon={<XCircle className="w-10 h-10" />}
          />
        </div>

        <div className="bg-[#F4F6F8] rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Rechercher un professeur, matiére, formation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
          />

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as RequestType | '')
            }
            className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
          >
            <option value="">Tous les types</option>
            <option value="Changement de salle">Changement de salle</option>
            <option value="Changement de statut">Changement de statut</option>
            <option value="Récupération de séance">Récupération de séance</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as RequestStatus | '')
            }
            className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003A68]"
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Approuvé">Approuvé</option>
            <option value="Refusé">Refusé</option>
          </select>
        </div>

        <div className="flex flex-col gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, index) => (
              <RequestCard key={index} {...req} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              Aucune demande trouvée.
            </div>
          )}
        </div>

      </div>
    </PageLayout>
  )
}