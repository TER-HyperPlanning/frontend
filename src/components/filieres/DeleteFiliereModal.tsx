import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/components/Button'
import { type FiliereSummary } from '@/types/formation'

interface DeleteFiliereModalProps {
  isOpen: boolean
  filiere: FiliereSummary | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteFiliereModal({
  isOpen,
  filiere,
  onClose,
  onConfirm,
}: DeleteFiliereModalProps) {
  return (
    <AnimatePresence>
      {isOpen && filiere && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Supprimer cette filière ?
              </h3>
              <p className="text-gray-500 mt-1">{filiere.nom}</p>
              {filiere.formations.length > 0 ? (
                <p className="text-amber-600 text-sm mt-3">
                  Cette filière a encore {filiere.formations.length} formation(s). Supprimez ou
                  déplacez-les avant de supprimer la filière.
                </p>
              ) : (
                <p className="text-gray-400 text-sm mt-2">Aucune formation liée.</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outlined"
                onClick={onClose}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
              >
                Annuler
              </Button>
              <Button
                onClick={onConfirm}
                disabled={filiere.formations.length > 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
