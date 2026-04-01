import { X } from 'lucide-react'
import Button from '../Button'

interface ConfirmChangeModalProps {
  oldDate: Date
  newDate: Date
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmChangeModal({
  oldDate,
  newDate,
  onConfirm,
  onCancel,
}: ConfirmChangeModalProps) {
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Confirmer le changement de séance
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Change Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                De :
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(oldDate)}
              </p>
            </div>
            <div className="relative h-8 flex items-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300" />
              </div>
              <div className="relative mx-auto">
                <span className="bg-gray-50 px-2 text-gray-500 text-xs">
                  ↓
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                À :
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDateTime(newDate)}
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              Vous allez envoyer une demande de changement à la scolarité. Merci
              d'attendre la confirmation de l'administration.
            </p>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
          <Button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium border border-[#003A68] text-[#003A68] bg-white rounded-lg hover:bg-gray-50"
          >
            Refuser
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#003A68] rounded-lg hover:bg-[#002847]"
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  )
}
