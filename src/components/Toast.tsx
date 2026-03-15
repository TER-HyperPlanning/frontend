import { useEffect } from 'react'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  id: string
  message: string
  type: ToastType
  onClose: (id: string) => void
  duration?: number
}

export default function Toast({ id, message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration)
    return () => clearTimeout(timer)
  }, [id, onClose, duration])

  const bgColor = {
    success: 'bg-emerald-900/80 border-emerald-700',
    error: 'bg-red-900/80 border-red-700',
    info: 'bg-blue-900/80 border-blue-700',
  }[type]

  const Icon = type === 'success' ? CheckCircleIcon : type === 'error' ? ExclamationCircleIcon : ExclamationCircleIcon

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} text-white animate-in fade-in slide-in-from-top-2`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button onClick={() => onClose(id)} className="text-white/70 hover:text-white transition-colors">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
