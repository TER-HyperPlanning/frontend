import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import Button from '../Button'
import Toast from '../Toast'
import { useToast } from '@/hooks/useToast'
import type { Session, UserRole } from '@/hooks/api/mock/sessionApi'
import {
  getSessionById,
  getDisponibilities,
  declareAbsence,
  requestReschedule,
  adminRescheduleSession,
  cancelTeacherRequest,
} from '@/hooks/api/mock/sessionApi'

interface SessionDetailsModalProps {
  sessionId: string
  userRole: UserRole
  onClose: () => void
  onSessionChange: () => Promise<void> | void
  onTopError: (message: string | null) => void
}

function formatDayLabel(iso: string) {
  const date = new Date(iso)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTimeLabel(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SessionDetailsModal({
  sessionId,
  userRole,
  onClose,
  onSessionChange,
  onTopError,
}: SessionDetailsModalProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRescheduleMode, setIsRescheduleMode] = useState(false)
  const [slotList, setSlotList] = useState<string[]>([])
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [localError, setLocalError] = useState<string | null>(null)

  const { toast, showToast, hideToast } = useToast()

  const isStudent = userRole === null
  const isAdmin = userRole === 'admin'
  const canAct = userRole === 'enseignant' || userRole === 'admin'

  const loadSession = async () => {
    setIsLoading(true)
    try {
      const data = await getSessionById(sessionId)
      setSession(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSession()
  }, [sessionId])

  useEffect(() => {
    if (!isRescheduleMode || !session) return

    const loadSlots = async () => {
      const durationMinutes = Math.round(
        (session.end.getTime() - session.start.getTime()) / 60_000,
      )

      const slots = await getDisponibilities(session.teacherId, session.groupId, {
        sessionId: session.id,
        durationMinutes,
        daysAhead: 14,
      })

      const filteredSlots = slots.filter((iso) => {
        const date = new Date(iso)
        return date.getTime() !== session.start.getTime()
      })

      setSlotList(filteredSlots)

      if (filteredSlots.length === 0) {
        setLocalError('Aucune disponibilité trouvée pour ce groupe et cet enseignant.')
        onTopError('Aucune disponibilité trouvée pour ce groupe et cet enseignant.')
        setSelectedDay('')
        setSelectedSlot('')
        return
      }

      setLocalError(null)
      onTopError(null)

      const firstDay = formatDayLabel(filteredSlots[0])
      setSelectedDay(firstDay)
      setSelectedSlot('')
    }

    void loadSlots()
  }, [isRescheduleMode, session, onTopError])

  const groupedSlots = useMemo(() => {
    const groups = new Map<string, string[]>()

    slotList.forEach((iso) => {
      const day = formatDayLabel(iso)
      const existing = groups.get(day) ?? []
      existing.push(iso)
      groups.set(day, existing)
    })

    return Array.from(groups.entries()).map(([day, slots]) => ({ day, slots }))
  }, [slotList])

  const visibleSlots = useMemo(() => {
    const group = groupedSlots.find((item) => item.day === selectedDay)
    return group?.slots ?? []
  }, [groupedSlots, selectedDay])

  const resetRescheduleState = () => {
    setIsRescheduleMode(false)
    setSlotList([])
    setSelectedDay('')
    setSelectedSlot('')
    setLocalError(null)
    onTopError(null)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDeclareAbsence = async () => {
    if (!session || !canAct) return

    setIsSubmitting(true)
    setLocalError(null)
    onTopError(null)

    try {
      const success = await declareAbsence(session.id, userRole)

      if (!success) {
        const message = 'Impossible de signaler l’absence.'
        setLocalError(message)
        onTopError(message)
        showToast(message, 'error')
        return
      }

      await onSessionChange()
      await loadSession()

      showToast(
        isAdmin ? 'Absence enregistrée.' : 'Demande d’absence envoyée à la scolarité.',
        'success',
      )
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReschedule = async () => {
    if (!session || !selectedSlot || !canAct) return

    const newStart = new Date(selectedSlot)
    const durationMs = session.end.getTime() - session.start.getTime()
    const newEnd = new Date(newStart.getTime() + durationMs)

    setIsSubmitting(true)
    setLocalError(null)
    onTopError(null)

    try {
      const success = isAdmin
        ? await adminRescheduleSession(session.id, newStart, newEnd)
        : await requestReschedule(session.id, newStart, newEnd)

      if (!success) {
        const message = 'Créneau non disponible.'
        setLocalError(message)
        onTopError(message)
        showToast(message, 'error')
        return
      }

      await onSessionChange()
      await loadSession()

      showToast(
        isAdmin ? 'Séance déplacée avec succès.' : 'Demande de déplacement envoyée.',
        'success',
      )
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelPendingRequest = async () => {
    if (!session || !canAct) return

    setIsSubmitting(true)
    setLocalError(null)
    onTopError(null)

    try {
      const success = await cancelTeacherRequest(session.id)

      if (!success) {
        const message = 'Impossible d’annuler la demande.'
        setLocalError(message)
        onTopError(message)
        showToast(message, 'error')
        return
      }

      await onSessionChange()
      await loadSession()

      showToast('Demande annulée.', 'success')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !session) {
    return (
      <>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleOverlayClick}
          role="presentation"
        >
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            Chargement...
          </div>
        </div>
        <Toast toast={toast} onClose={hideToast} />
      </>
    )
  }

  return (
    <>
      <div
        className="fixed  inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div className="mx-4 w-full max-h-[70vh] overflow-y-auto max-w-lg  rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Détails de la séance
              </h2>
              <p className="mt-1 text-sm text-gray-500">{session.title}</p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1 transition-colors hover:bg-gray-100"
              aria-label="Fermer"
              type="button"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            {localError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {localError}
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {session.start.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Horaire
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {session.start.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {session.end.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Groupe
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {session.group}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Enseignant
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {session.teacherName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Salle
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {session.room || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Étudiants
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {session.studentsCount ?? '—'}
                  </p>
                </div>
              </div>
            </div>

     

           
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Statut
              </p>
              <div className="mt-2">
                {session.status === 'active' && (
                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                )}
                {session.status === 'pending' && (
                  <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                    En attente
                  </span>
                )}
                {session.status === 'absent' && (
                  <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                    Absence
                  </span>
                )}
              </div>
            </div>

            {isRescheduleMode && canAct && (
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jour
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => {
                      setSelectedDay(e.target.value)
                      setSelectedSlot('')
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {groupedSlots.map((item) => (
                      <option key={item.day} value={item.day}>
                        {item.day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Horaires disponibles
                  </p>

                  {visibleSlots.length === 0 ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      Aucun horaire disponible pour ce jour.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {visibleSlots.map((slot) => {
                        const isSelected = selectedSlot === slot

                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {formatTimeLabel(slot)}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-gray-200 bg-gray-50 p-6">
            <Button
              onClick={() => {
                if (isRescheduleMode) {
                  resetRescheduleState()
                } else {
                  onClose()
                }
              }}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {isRescheduleMode ? 'Retour' : 'Fermer'}
            </Button>

            {!isStudent && session.status === 'pending' && !isRescheduleMode && (
              <Button
                onClick={handleCancelPendingRequest}
                disabled={isSubmitting}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi...' : 'Annuler la demande'}
              </Button>
            )}

            {canAct && session.status !== 'pending' && !isRescheduleMode && (
              <>
                <Button
                  onClick={handleDeclareAbsence}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Envoi...'
                    : isAdmin
                      ? 'Marquer absent'
                      : 'Signaler absence'}
                </Button>

                <Button
                  onClick={() => {
                    setLocalError(null)
                    onTopError(null)
                    setIsRescheduleMode(true)
                  }}
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#003A68] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAdmin ? 'Déplacer la séance' : 'Demander déplacement'}
                </Button>
              </>
            )}

            {canAct && isRescheduleMode && (
              <Button
                onClick={handleSubmitReschedule}
                disabled={isSubmitting || !selectedSlot}
                className="rounded-lg bg-[#003A68] px-4 py-2 text-sm font-medium text-white hover:bg-[#002847] disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi...' : isAdmin ? 'Appliquer' : 'Confirmer'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </>
  )
}