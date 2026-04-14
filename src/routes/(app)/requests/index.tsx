import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '@/layout/PageLayout'
import RequestCard from '@/components/requests/RequestCard'
import RequestDetailsModal from '@/components/requests/RequestDetailsModal'
import Toast from '@/components/requests/Toast'
import Header from '@/components/requests/Header'

import { useSessionChanges } from '@/hooks/requests/useSessionChanges'
import type { SessionChange } from '@/types/sessionChange'

type RequestStatus = 'En attente' | 'Approuvé' | 'Refusé'
type RequestType =
  | 'Changement de salle'
  | 'Proposition de récupération de séance'

export const Route = createFileRoute('/(app)/requests/')({
  component: RequestsPage,
})

/* =========================
   STATUS FORMATTER
========================= */
const formatStatus = (status: string) => {
  switch (status) {
    case 'ATTENTE':
      return 'En attente'
    case 'APPROUVE':
      return 'Approuvé'
    case 'REFUSE':
      return 'Refusé'
    default:
      return status
  }
}

export default function RequestsPage() {
  const { data: requests = [], isLoading } = useSessionChanges()

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<RequestStatus | ''>('')

  const [filterType, setFilterType] = useState<RequestType | ''>('')

  const [selectedRequest, setSelectedRequest] =
    useState<SessionChange | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  /* =========================
     FILTER
  ========================= */
  const filteredRequests = (requests || [])
    .filter(Boolean)
    .filter((req) => {
      const searchLower = search.toLowerCase()

      const matchesSearch =
        (req.teacherName ?? '').toLowerCase().includes(searchLower) ||
        (req.courseName ?? '').toLowerCase().includes(searchLower) ||
        (req.teacherEmail ?? '').toLowerCase().includes(searchLower)

      return (
        matchesSearch &&
        (filterStatus === '' ||
          formatStatus(req.changeStatusLabel) === filterStatus) &&
        (filterType === '' || req.changeType === filterType)
      )
    })
    .sort((a, b) => {
      const aStatus = formatStatus(a.changeStatusLabel)
      const bStatus = formatStatus(b.changeStatusLabel)

      if (aStatus === 'En attente' && bStatus !== 'En attente') return -1
      if (aStatus !== 'En attente' && bStatus === 'En attente') return 1

      return 0
    })

  /* =========================
     COUNTERS
  ========================= */
  const pendingCount = requests.filter(
    (r) => formatStatus(r.changeStatusLabel) === 'En attente'
  ).length

  const approvedCount = requests.filter(
    (r) => formatStatus(r.changeStatusLabel) === 'Approuvé'
  ).length

  const refusedCount = requests.filter(
    (r) => formatStatus(r.changeStatusLabel) === 'Refusé'
  ).length

  const handleViewDetails = (request: SessionChange) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <PageLayout className="min-h-screen flex items-center justify-center">
        <div>Chargement...</div>
      </PageLayout>
    )
  }

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

        {/* LIST */}
        <div className="flex flex-col gap-6 overflow-y-auto pt-2">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                data={req}
                onViewDetails={() => handleViewDetails(req)}
              />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              Aucune demande trouvée.
            </div>
          )}
        </div>

        {/* MODAL */}
        {selectedRequest && (
          <RequestDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            request={selectedRequest}
            setToast={setToast}
          />
        )}

        {/* TOAST */}
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