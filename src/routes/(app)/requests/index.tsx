import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import RequestCard from '@/components/requests/RequestCard'
import PageLayout from '@/layout/PageLayout'
import RequestDetailsModal from '@/components/requests/RequestDetailsModal'
import Toast from '@/components/requests/Toast'
import Header from '@/components/requests/Header'

import { useSessionChangeService } from '@/services/requestservices'
import type { SessionChange } from '@/types/sessionChange'

type RequestStatus = 'En attente' | 'Approuvé' | 'Refusé'
type RequestType =
  | 'Changement de salle'
  | 'Proposition de récupération de séance'

export const Route = createFileRoute('/(app)/requests/')({
  component: RequestsPage,
})

export default function RequestsPage() {
  const { getRequests } = useSessionChangeService()

  const [requests, setRequests] = useState<SessionChange[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] =
  useState<RequestStatus | ''>('')

  const [filterType, setFilterType] =
  useState<RequestType | ''>('')

  const [selectedRequest, setSelectedRequest] = useState<SessionChange | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  // 🔥 LOAD DATA FROM SERVICE
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRequests()
        setRequests(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // 🔍 FILTER SAFE
  const filteredRequests = requests
    .filter((req) => {
      const searchLower = search.toLowerCase()

      const matchesSearch =
        (req.teacher ?? '').toLowerCase().includes(searchLower) ||
        (req.subject ?? '').toLowerCase().includes(searchLower) ||
        (req.formation ?? '').toLowerCase().includes(searchLower) ||
        (req.type ?? '').toLowerCase().includes(searchLower)

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

  const handleViewDetails = (request: SessionChange) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const pendingCount = requests.filter((r) => r.status === 'En attente').length
  const approvedCount = requests.filter((r) => r.status === 'Approuvé').length
  const refusedCount = requests.filter((r) => r.status === 'Refusé').length

  if (loading) {
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
            filteredRequests.map((req, index) => (
              <RequestCard
                key={index}
                {...req}
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