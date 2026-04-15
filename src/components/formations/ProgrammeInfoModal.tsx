import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { type Formation } from '@/types/formation'

interface ProgrammeInfoModalProps {
  isOpen: boolean
  formation: Formation | null
  onClose: () => void
}

export default function ProgrammeInfoModal({
  isOpen,
  formation,
  onClose,
}: ProgrammeInfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && formation && (
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Programme — {formation.nom}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              {formation.programme ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {formation.programme}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Aucun programme défini pour cette formation.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
