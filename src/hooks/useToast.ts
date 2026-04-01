import { useState, useCallback, useRef } from 'react'

export interface ToastData {
  message: string
  type: 'success' | 'error'
}

export function useToast(duration = 3000) {
  const [toast, setToast] = useState<ToastData | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showToast = useCallback(
    (message: string, type: 'success' | 'error') => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast({ message, type })
      timerRef.current = setTimeout(() => {
        setToast(null)
      }, duration)
    },
    [duration],
  )

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  return { toast, showToast, hideToast }
}
