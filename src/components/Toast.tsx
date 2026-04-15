import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import { type ToastData } from '@/hooks/useToast'

export interface ToastProps {
  toast: ToastData | null
  onClose: () => void
}

export default function Toast({ toast, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-6 right-6 z-[100]"
        >
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg min-w-[300px] max-w-sm',
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800',
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon className="size-6 shrink-0 text-green-500" />
            ) : (
              <XCircleIcon className="size-6 shrink-0 text-red-500" />
            )}
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={onClose}
              className="p-0.5 rounded hover:bg-black/5 transition-colors shrink-0"
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
