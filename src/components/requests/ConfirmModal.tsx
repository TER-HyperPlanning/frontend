interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  details?: React.ReactNode
  confirmLabel?: string
  confirmColor?: 'green' | 'red'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  details,
  confirmLabel = 'Confirmer',
  confirmColor = 'green',
}: ConfirmModalProps) {
  if (!isOpen) return null

  const colorClass =
    confirmColor === 'red'
      ? 'bg-red-500 hover:bg-red-600'
      : 'bg-green-500 hover:bg-green-600'

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#003A68] mb-4">
          {title}
        </h3>

        <p className="text-gray-700 mb-4">{description}</p>

        {details && <div className="text-gray-700 mb-6">{details}</div>}

        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-2 rounded-xl ${colorClass}`}
          >
            {confirmLabel}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-xl"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}