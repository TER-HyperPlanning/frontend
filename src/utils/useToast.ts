import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/Toast'

interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])

    if (duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration || 4000)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message: string, duration?: number) => addToast(message, 'success', duration), [addToast])
  const error = useCallback((message: string, duration?: number) => addToast(message, 'error', duration), [addToast])
  const info = useCallback((message: string, duration?: number) => addToast(message, 'info', duration), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  }
}
