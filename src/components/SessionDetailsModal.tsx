import { type MouseEvent, useEffect } from 'react'
import Button from './Button'

export type Session = {
  id: string
  course: string
  group: string
  studentCount: number
  room: string
  building?: string
  equipment: string
  notes?: string
  dateLabel?: string
  startTime?: string
  endTime?: string
}

interface SessionDetailsModalProps {
  session: Session
  onClose: () => void
}

export default function SessionDetailsModal({ session, onClose }: SessionDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleOverlayClick = () => {
    onClose()
  }

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={handleContentClick}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
          aria-label="Fermer la fenêtre des détails de séance"
        >
          ✕
        </button>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Détails de la séance</p>
          <h2 className="mt-1 text-2xl font-bold text-stone-900">{session.course}</h2>
          <p className="mt-1 text-sm text-stone-500">
            Groupe&nbsp;
            <span className="font-medium text-stone-700">{session.group}</span> ·{' '}
            <span className="font-medium text-stone-700">{session.studentCount}</span> étudiants
          </p>
          {(session.dateLabel || session.startTime) && (
            <p className="mt-1 text-xs text-stone-400">
              {session.dateLabel && <span className="font-medium text-stone-600">{session.dateLabel}</span>}
              {session.startTime && (
                <>
                  {' '}
                  · <span>{session.startTime}</span>
                  {session.endTime && <span> - {session.endTime}</span>}
                </>
              )}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Salle</p>
            <p className="mt-1 text-base font-medium text-stone-900">{session.room}</p>
            {session.building && (
              <p className="mt-1 text-xs text-stone-500">
                Bâtiment&nbsp;
                <span className="font-medium text-stone-700">{session.building}</span>
              </p>
            )}
          </div>

          <div className="rounded-xl border border-stone-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Matériel nécessaire</p>
            <p className="mt-1 text-sm text-stone-800 whitespace-pre-line">
              {session.equipment || 'Aucun matériel particulier indiqué.'}
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Remarques</p>
            <p className="mt-1 text-sm text-stone-800 whitespace-pre-line">
              {session.notes && session.notes.trim().length > 0
                ? session.notes
                : 'Aucune remarque ajoutée pour cette séance.'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="outlined" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  )
}

