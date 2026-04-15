import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/components/Button'

interface Props {
  isOpen: boolean
  data: {
    originalStart: Date
    originalEnd: Date
    newStart: Date
    newEnd: Date
  } | null
  isLoading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

function formatDate(date: Date | null) {
  if (!date) return ''
  return date.toLocaleString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DragDropConfirmModal({
  isOpen,
  data,
  isLoading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={onCancel}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmer le changement de séance ?
              </h3>

              <p className="text-gray-500 mt-2">
                Nouvelle plage horaire :
              </p>

              <div className="mt-3 text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-md">
                {formatDate(data.newStart)} → {formatDate(data.newEnd)}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outlined"
                onClick={onCancel}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </Button>

              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 bg-primary-900 hover:bg-primary-700"
              >
                Confirmer
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}