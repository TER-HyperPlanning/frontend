import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  type SessionWithGroup,
  SESSION_TYPE_LABELS,
  SESSION_MODE_LABELS,
} from '@/types/session'

interface SessionDetailsModalProps {
  isOpen: boolean
  session: SessionWithGroup | null
  canManageSessions?: boolean
  onClose: () => void
  onEdit: (session: SessionWithGroup) => void
  onDelete: (session: SessionWithGroup) => void
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SessionDetailsModal({
  isOpen,
  session,
  canManageSessions = false,
  onClose,
  onEdit,
  onDelete,
}: SessionDetailsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && session && (
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
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                Détails de la séance
              </h2>

              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              {/* Type */}
              <div className="border-l-4 border-indigo-500 pl-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Type
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {SESSION_TYPE_LABELS[session.type]}
                </p>
              </div>

              {/* Mode */}
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Mode
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {SESSION_MODE_LABELS[session.mode]}
                </p>
              </div>

              {/* Course */}
              {session.course && (
                <div className="border-l-4 border-teal-500 pl-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Module
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {session.course}
                  </p>
                </div>
              )}

              {/* Group */}
              {session.groupName && (
                <div className="border-l-4 border-emerald-500 pl-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Groupe
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {session.groupName}
                  </p>
                </div>
              )}

              {/* Room */}
              {session.room && (
                <div className="border-l-4 border-rose-500 pl-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Salle
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {session.room}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="border-l-4 border-violet-500 pl-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Date
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {formatDateTime(session.startDateTime)}
                </p>
              </div>

              {/* Description */}
              {session.description && (
                <div className="border-l-4 border-fuchsia-500 pl-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {session.description}
                  </p>
                </div>
              )}
            </div>

            {canManageSessions ? (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => onEdit(session)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-primary-900 hover:bg-primary-50 rounded-md px-3 py-2 text-sm font-medium transition"
                >
                  <PencilSquareIcon className="size-4" />
                  Modifier
                </button>

                <button
                  onClick={() => onDelete(session)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-red-900 hover:bg-red-50 rounded-md px-3 py-2 text-sm font-medium transition"
                >
                  <TrashIcon className="size-4" />
                  Supprimer
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}