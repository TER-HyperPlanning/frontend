import { useState } from 'react'
import { X } from 'lucide-react'
import type { EventApi } from '@fullcalendar/core'
import Button from '../Button'
import Toast from '../Toast'
import { useToast } from '@/hooks/useToast'

interface SessionDetailsModalProps {
  event: EventApi
  onClose: () => void
  onEventUpdate: (eventId: string, status: string) => void
}

// Mock data for demonstration
const MOCK_DATA = {
  group: 'Groupe A1',
  studentsCount: 28,
  room: 'Amphithéâtre 1',
  equipment: ['Vidéoprojecteur', 'Tableau blanc'],
  remarks: 'Session importante - Présence obligatoire',
}

// Fake API functions
const declareAbsence = (eventId: string): Promise<{ status: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'pending' })
    }, 800)
  })
}

const requestReschedule = (
  eventId: string,
  newDate: Date,
): Promise<{ status: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'pending' })
    }, 800)
  })
}

export function SessionDetailsModal({
  event,
  onClose,
  onEventUpdate,
}: SessionDetailsModalProps) {
  const [isRescheduleMode, setIsRescheduleMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const { toast, showToast, hideToast } = useToast()

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDeclareAbsence = async () => {
    try {
      setIsSubmitting(true)
      const result = await declareAbsence(event.id)
      if (result.status === 'pending') {
        showToast('Absence signalée avec succès', 'success')
        onEventUpdate(event.id, 'pending')
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error) {
      showToast('Erreur lors de la signalisation de l\'absence', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestReschedule = async () => {
    if (isRescheduleMode) {
      if (!selectedDate) {
        showToast('Veuillez sélectionner une date', 'error')
        return
      }

      try {
        setIsSubmitting(true)
        const newDate = new Date(selectedDate)
        const result = await requestReschedule(event.id, newDate)
        if (result.status === 'pending') {
          showToast('Demande de déplacement envoyée', 'success')
          onEventUpdate(event.id, 'pending')
          setTimeout(() => {
            onClose()
          }, 1500)
        }
      } catch (error) {
        showToast('Erreur lors de la demande de déplacement', 'error')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsRescheduleMode(true)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleOverlayClick}
        onKeyDown={handleEscapeKey}
        role="presentation"
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Détails de la session
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h3>
              {event.extendedProps?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {event.extendedProps.description}
                </p>
              )}
            </div>

            {/* Session Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Groupe
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {MOCK_DATA.group}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Étudiants
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {MOCK_DATA.studentsCount}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Salle
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {MOCK_DATA.room}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Équipements
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {MOCK_DATA.equipment.join(', ')}
                </p>
              </div>
            </div>

            {/* Remarks */}
            {MOCK_DATA.remarks && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                  Remarques
                </p>
                <p className="text-sm text-blue-800 mt-1">{MOCK_DATA.remarks}</p>
              </div>
            )}

            {/* Reschedule Date Picker */}
            {isRescheduleMode && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Sélectionner une nouvelle date
                </label>
                <input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Footer - Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
            {!isRescheduleMode ? (
              <>
                <Button
                  onClick={handleDeclareAbsence}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi...' : 'Signaler absence'}
                </Button>
                <Button
                  onClick={handleRequestReschedule}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Demander déplacement
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setIsRescheduleMode(false)
                    setSelectedDate('')
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleRequestReschedule}
                  disabled={isSubmitting || !selectedDate}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi...' : 'Confirmer'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}
