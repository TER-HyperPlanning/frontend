import { X } from 'lucide-react'
import Button from '../Button'
import type { UserRole } from '@/hooks/api/mock/sessionApi'

interface ConfirmChangeModalProps {
  title: string
  oldDate: Date
  newDate: Date
  onConfirm: () => void
  onCancel: () => void
  userRole?: UserRole
  isLoading?: boolean
}

export function ConfirmChangeModal({
  title,
  oldDate,
  newDate,
  onConfirm,
  onCancel,
  userRole,
  isLoading = false,
}: ConfirmChangeModalProps) {
  const isAdmin = userRole === 'admin'

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
      ' à ' +
      date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Confirmer le changement
            </h2>
            <p className="mt-1 text-sm text-gray-500">{title}</p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Ancien créneau
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(oldDate)}
              </p>
            </div>

            <div className="my-4 flex items-center justify-center text-gray-400">
              ↓
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Nouveau créneau
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(newDate)}
              </p>
            </div>
          </div>

          <div
            className={`rounded-lg border p-4 ${
              isAdmin
                ? 'border-green-100 bg-green-50'
                : 'border-blue-100 bg-blue-50'
            }`}
          >
            <p className="text-sm leading-relaxed text-gray-700">
              {isAdmin
                ? 'La séance sera modifiée immédiatement.'
                : 'La demande sera envoyée à la scolarité. La séance reste en attente tant que la demande n’est pas traitée.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-[#003A68] bg-white px-4 py-2 text-sm font-medium text-[#003A68] hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-[#003A68] px-4 py-2 text-sm font-medium text-white hover:bg-[#002847] disabled:opacity-50"
          >
            {isLoading ? 'Envoi...' : isAdmin ? 'Appliquer' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  )
}